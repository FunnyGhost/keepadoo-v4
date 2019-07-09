import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SessionQuery } from '../../state/session.query';
import { MovieSearchResult } from '../movie-search/state/models/movie-search-results';
import { Movie } from '../movies/state/models/movie';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesList } from './models/movies-list';
import { MoviesListsQuery } from './movies-lists.query';
import { MoviesListsStore } from './movies-lists.store';

@Injectable()
export class MoviesListsService {
  readonly MOST_RECENT_MOVIES_LIMIT = 4;
  private moviesListsCollection: AngularFirestoreCollection;

  constructor(
    private moviesListsQuery: MoviesListsQuery,
    private moviesListsStore: MoviesListsStore,
    private firestoreService: AngularFirestore,
    private sessionQuery: SessionQuery,
    private moviesService: MoviesService
  ) {
    this.sessionQuery.userId$.subscribe((userId: string) => {
      if (userId) {
        this.setupMoviesListsCollection(firestoreService, userId);
        this.fetch();
      } else {
        this.moviesListsStore.set([]);
      }
    });
  }

  fetch(): void {
    this.moviesListsCollection
      .auditTrail()
      .pipe(
        map((changes: any[]) => {
          const list = changes.map(
            data =>
              ({
                id: data.payload.doc.id,
                ...data.payload.doc.data()
              } as MoviesList)
          );
          return list;
        }),
        tap((moviesLists: MoviesList[]) => {
          moviesLists.forEach((list: MoviesList) => {
            this.moviesService
              .getMoviesInList(list.id, this.MOST_RECENT_MOVIES_LIMIT)
              .subscribe((movies: Movie[]) => {
                this.addMoviesToList(list.id, movies);
              });
          });
        }),
        tap((moviesLists: MoviesList[]) => {
          moviesLists.forEach((list: MoviesList) => {
            this.moviesService
              .getNumberOfMoviesInList(list.id)
              .subscribe((itemsCount: number) => {
                this.setListSize(list.id, itemsCount);
              });
          });
        })
      )
      .subscribe((moviesLists: MoviesList[]) => {
        this.moviesListsStore.set(moviesLists);
      });
  }

  async add(moviesList: Partial<MoviesList>): Promise<void> {
    const userId = this.sessionQuery.userId();
    const id = this.firestoreService.createId();
    const list: MoviesList = {
      ...moviesList,
      id: id,
      userId: userId,
      numberOfMovies: 0
    };
    await this.moviesListsCollection.doc(id).set(list);
    this.moviesListsStore.add(list);
  }

  async update(id, moviesList: Partial<MoviesList>): Promise<void> {
    await this.moviesListsCollection.doc(id).update(moviesList);
    this.moviesListsStore.update(id, moviesList);
  }

  async remove(id: string): Promise<void> {
    await this.moviesListsCollection.doc(id).delete();
    this.moviesListsStore.remove(id);
  }

  setActive(id: string): void {
    this.moviesListsStore.setActive(id);
  }

  removeActive(id: string): void {
    this.moviesListsStore.removeActive(id);
  }

  addMovieToCurrentList(movie: MovieSearchResult): void {
    const activeList = this.moviesListsQuery.getActive() as MoviesList;
    from(this.moviesService.addMovieToList(activeList.id, movie)).subscribe(
      () => this.fetch()
    );
  }

  private addMoviesToList(listId: string, movies: Movie[]): void {
    this.moviesListsStore.update(listId, { lastMovies: movies });
  }

  private setListSize(listId: string, size: number): void {
    this.moviesListsStore.update(listId, { numberOfMovies: size });
  }

  private setupMoviesListsCollection(
    firestoreService: AngularFirestore,
    userId: string
  ): void {
    this.moviesListsCollection = firestoreService.collection(
      `movies-lists`,
      /* istanbul ignore next */
      ref => {
        let query:
          | firebase.firestore.CollectionReference
          | firebase.firestore.Query = ref;
        query = query.where('userId', '==', userId);
        return query;
      }
    );
  }
}

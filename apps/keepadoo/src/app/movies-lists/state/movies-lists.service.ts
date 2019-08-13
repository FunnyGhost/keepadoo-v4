import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { from } from 'rxjs';
import { SessionQuery } from '../../state/session.query';
import { MovieSearchResult } from '../movie-search/state/models/movie-search-results';
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
      .valueChanges({ idField: 'id' })
      .subscribe((moviesLists: MoviesList[]) => {
        this.moviesListsStore.set(moviesLists);
      });
  }

  async add(moviesList: Partial<MoviesList>): Promise<void> {
    const userId = this.sessionQuery.userId();
    const id = this.firestoreService.createId();
    const list = {
      ...moviesList,
      id: id,
      userId: userId,
      moviesCount: 0,
      recentMovies: []
    } as MoviesList;
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

  private setupMoviesListsCollection(
    firestoreService: AngularFirestore,
    userId: string
  ): void {
    this.moviesListsCollection = firestoreService.collection(
      `movies-lists`,
      /* istanbul ignore next */
      ref => ref.where('userId', '==', userId)
    );
  }
}

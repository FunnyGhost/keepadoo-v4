import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot } from '@angular/fire/firestore';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SessionQuery } from '../../../state/session.query';
import { MovieSearchResult } from '../../movie-search/state/models/movie-search-results';
import { MoviesList } from '../../state/models/movies-list';
import { MoviesListsQuery } from '../../state/movies-lists.query';
import { Movie } from './models/movie';
import { MoviesStore } from './movies.store';

@Injectable()
export class MoviesService {
  constructor(
    private firestoreService: AngularFirestore,
    sessionQuery: SessionQuery,
    moviesListsQuery: MoviesListsQuery,
    private moviesStore: MoviesStore
  ) {
    combineLatest([
      sessionQuery.userId$,
      moviesListsQuery.selectActive()
    ]).subscribe(([userId, moviesList]: [string, MoviesList]) => {
      if (!userId || !moviesList) {
        moviesStore.set([]);
      } else {
        this.getMoviesInList(moviesList.id).subscribe(movies =>
          moviesStore.set(movies)
        );
      }
    });
  }

  public getMoviesInList(listId: string, limit = 0): Observable<Movie[]> {
    return this.firestoreService
      .collection(
        `movies`,
        /* istanbul ignore next */
        ref => {
          let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = ref;
          query = query.where('listId', '==', listId);
          if (limit) {
            query = query.limit(limit);
          }
          return query;
        }
      )
      .snapshotChanges()
      .pipe(
        map(changes => {
          const movies = changes.map(data => {
            const movie = {
              id: data.payload.doc.id,
              ...data.payload.doc.data()
            } as Movie;
            return movie;
          });
          return movies;
        }),
        take(1)
      );
  }

  public getNumberOfMoviesInList(listId: string): Observable<number> {
    return this.firestoreService
      .collection(
        `movies`,
        /* istanbul ignore next */
        ref => {
          let query:
            | firebase.firestore.CollectionReference
            | firebase.firestore.Query = ref;
          query = query.where('listId', '==', listId);
          return query;
        }
      )
      .get()
      .pipe(
        map((data: QuerySnapshot<{}>) => {
          return data.size;
        }),
        take(1)
      );
  }

  public async addMovieToList(listId: string, movie: MovieSearchResult) {
    return this.firestoreService.collection(`movies`).add({ ...movie, listId });
  }

  public async deleteMovie(movie: Movie) {
    return this.firestoreService
      .collection(`movies`)
      .doc(movie.listId)
      .delete();
  }

  public enableEditMode(): void {
    this.moviesStore.update({ editMode: true });
  }

  public disableEditMode(): void {
    this.moviesStore.update({ editMode: false });
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { combineLatest, from, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { SessionQuery } from '../../../state/session.query';
import { MovieSearchResult } from '../../movie-search/state/models/movie-search-results';
import { MoviesList } from '../../state/models/movies-list';
import { MoviesListsQuery } from '../../state/movies-lists.query';
import { Movie } from './models/movie';
import { MoviesStore } from './movies.store';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable()
export class MoviesService {
  constructor(
    private firestoreService: AngularFirestore,
    sessionQuery: SessionQuery,
    moviesListsQuery: MoviesListsQuery,
    private moviesStore: MoviesStore,
    private notificationService: HotToastService
  ) {
    combineLatest([sessionQuery.userId$, moviesListsQuery.selectActive()]).subscribe(
      ([userId, moviesList]: [string, MoviesList]) => {
        if (!userId || !moviesList) {
          moviesStore.set([]);
        } else {
          this.getMoviesInList(moviesList.id).subscribe((movies) => moviesStore.set(movies));
        }
      }
    );
  }

  public getMoviesInList(listId: string): Observable<Movie[]> {
    return this.firestoreService
      .collection<Movie[]>(
        `movies`,
        /* istanbul ignore next */
        (ref) => ref.where('listId', '==', listId)
      )
      .valueChanges({ idField: 'key' })
      .pipe(take(1)) as Observable<Movie[]>;
  }

  public async addMovieToList(listId: string, movie: MovieSearchResult) {
    const addedOn = new Date().toISOString();
    return this.firestoreService.collection(`movies`).add({ ...movie, listId, added_on: addedOn });
  }

  public async deleteMovie(movie: Movie) {
    const movieToDelete = this.firestoreService.collection(`movies`).doc(movie.key);
    await movieToDelete.delete();
    this.moviesStore.remove(movie.id);
    this.notificationService.success('Movie deleted!', {
      duration: 3000
    });
  }

  public async deleteMoviesInList(listId: string): Promise<void> {
    return this.firestoreService
      .collection(`movies`, (ref) => ref.where('listId', '==', listId))
      .snapshotChanges()
      .pipe(
        take(1),
        switchMap((data) => from(data)),
        switchMap((item) => item.payload.doc.ref.delete())
      )
      .toPromise();
  }

  public enableEditMode(): void {
    this.moviesStore.update({ editMode: true });
  }

  public disableEditMode(): void {
    this.moviesStore.update({ editMode: false });
  }
}

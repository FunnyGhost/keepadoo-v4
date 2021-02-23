import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { SessionQuery } from '../../state/session.query';
import { MovieSearchResult } from '../movie-search/state/models/movie-search-results';
import { MoviesService } from '../movies/state/movies.service';
import { MoviesList } from './models/movies-list';
import { MoviesListsQuery } from './movies-lists.query';
import { MoviesListsStore } from './movies-lists.store';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable()
export class MoviesListsService {
  private moviesListsCollection: AngularFirestoreCollection;

  constructor(
    private moviesListsQuery: MoviesListsQuery,
    private moviesListsStore: MoviesListsStore,
    private firestoreService: AngularFirestore,
    private sessionQuery: SessionQuery,
    private moviesService: MoviesService,
    private toast: HotToastService
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
    this.moviesListsStore.setLoading(true);
    try {
      const userId = this.sessionQuery.userId();
      const id = this.firestoreService.createId();
      const list = {
        ...moviesList,
        id,
        userId,
        moviesCount: 0,
        recentMovies: []
      } as MoviesList;
      await this.moviesListsCollection.doc(id).set(list);
      this.moviesListsStore.add(list);
      this.toast.success('List created!', {
        duration: 3000
      });
    } catch (err) {
      this.moviesListsStore.setError(err);
      this.toast.error('List creation failed.', {
        duration: 3000
      });
    }

    this.moviesListsStore.setLoading(false);
  }

  async update(id, moviesList: Partial<MoviesList>): Promise<void> {
    await this.moviesListsCollection.doc(id).update(moviesList);
    this.moviesListsStore.update(id, moviesList);
    this.toast.success('List updated!', {
      duration: 3000
    });
  }

  async remove(id: string): Promise<void> {
    await this.moviesService.deleteMoviesInList(id);
    await this.moviesListsCollection.doc(id).delete();
    this.toast.success('List deleted!', {
      duration: 3000
    });
  }

  setActive(id: string): void {
    this.moviesListsStore.setActive(id);
  }

  removeActive(id: string): void {
    this.moviesListsStore.removeActive(id);
  }

  addMovieToCurrentList(movie: MovieSearchResult): void {
    const activeList = this.moviesListsQuery.getActive() as MoviesList;
    from(this.moviesService.addMovieToList(activeList.id, movie)).subscribe(() => {
      this.toast.success('Movie added!', {
        duration: 3000
      });
      this.fetch();
    });
  }

  private setupMoviesListsCollection(firestoreService: AngularFirestore, userId: string): void {
    this.moviesListsCollection = firestoreService.collection(
      `movies-lists`,
      /* istanbul ignore next */
      (ref) => ref.where('userId', '==', userId)
    );
  }
}

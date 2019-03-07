import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { SessionQuery } from '../../state/session.query';
import { MoviesListsModule } from '../movies-lists.module';
import { MoviesList } from './models/movies-list';
import { MoviesListsStore } from './movies-lists.store';

@Injectable({ providedIn: MoviesListsModule })
export class MoviesListsService {
  private moviesListsCollection: AngularFirestoreCollection;

  constructor(
    private moviesListsStore: MoviesListsStore,
    private firestoreService: AngularFirestore,
    private sessionQuery: SessionQuery
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
      .valueChanges()
      .subscribe((moviesLists: MoviesList[]) => {
        this.moviesListsStore.set(moviesLists);
      });
  }

  async add(moviesList: Partial<MoviesList>): Promise<void> {
    const userId = this.sessionQuery.userId();
    const id = this.firestoreService.createId();
    const list: MoviesList = { ...moviesList, id: id, userId: userId };
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

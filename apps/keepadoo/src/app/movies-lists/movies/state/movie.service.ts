import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Movie } from './models/movie';

@Injectable()
export class MoviesService {
  constructor(private firestoreService: AngularFirestore) {}

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
          return changes.map(
            data =>
              ({
                id: data.payload.doc.id,
                ...data.payload.doc.data()
              } as Movie)
          );
        }),
        take(1)
      );
  }
}

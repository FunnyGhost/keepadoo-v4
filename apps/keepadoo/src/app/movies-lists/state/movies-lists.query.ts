import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MoviesListsModule } from '../movies-lists.module';
import { MoviesList } from './models/movies-list';
import { MoviesListsState, MoviesListsStore } from './movies-lists.store';

@Injectable({
  providedIn: MoviesListsModule
})
export class MoviesListsQuery extends QueryEntity<
  MoviesListsState,
  MoviesList
> {
  constructor(protected store: MoviesListsStore) {
    super(store);
  }
}

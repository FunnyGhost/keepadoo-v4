import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MoviesList } from './models/movies-list';
import { MoviesListsState, MoviesListsStore } from './movies-lists.store';

@Injectable()
export class MoviesListsQuery extends QueryEntity<
  MoviesListsState,
  MoviesList
> {
  constructor(protected store: MoviesListsStore) {
    super(store);
  }
}

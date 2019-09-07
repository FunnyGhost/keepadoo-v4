import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { MoviesList } from './models/movies-list';

export interface MoviesListsState extends EntityState<MoviesList> {}

@Injectable()
@StoreConfig({ name: 'movies-lists' })
export class MoviesListsStore extends EntityStore<
  MoviesListsState,
  MoviesList
> {
  constructor() {
    super();
  }
}

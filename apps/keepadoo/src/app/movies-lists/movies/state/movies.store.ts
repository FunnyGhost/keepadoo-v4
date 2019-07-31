import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Movie } from './models/movie';

export interface MoviesState extends EntityState<Movie> {
  editMode: boolean;
}

@Injectable()
@StoreConfig({ name: 'movies' })
export class MoviesStore extends EntityStore<MoviesState, Movie> {
  constructor() {
    super({ editMode: false });
  }
}

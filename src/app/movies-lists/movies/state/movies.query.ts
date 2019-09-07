import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Movie } from './models/movie';
import { MoviesState, MoviesStore } from './movies.store';

@Injectable()
export class MoviesQuery extends QueryEntity<MoviesState, Movie> {
  constructor(protected store: MoviesStore) {
    super(store);
  }
}

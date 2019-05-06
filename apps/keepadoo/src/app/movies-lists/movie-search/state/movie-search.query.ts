import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MovieSearchResult } from './models/movie-search-results';
import { MovieSearchState, MovieSearchStore } from './movie-search.store';

@Injectable()
export class MovieSearchQuery extends QueryEntity<
  MovieSearchState,
  MovieSearchResult
> {
  constructor(protected store: MovieSearchStore) {
    super(store);
  }
}

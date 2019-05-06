import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { MovieSearchResult } from './models/movie-search-results';
import { MovieSearchStore } from './movie-search.store';

@Injectable()
export class MovieSearchService {
  constructor(
    private movieSearchStore: MovieSearchStore,
    private http: HttpClient
  ) {}

  get() {
    this.http
      .get('https://akita.com')
      .subscribe(entities => this.movieSearchStore.set(entities));
  }

  add(movieSearch: MovieSearchResult) {
    this.movieSearchStore.add(movieSearch);
  }

  update(id, movieSearch: Partial<MovieSearchResult>) {
    this.movieSearchStore.update(id, movieSearch);
  }

  remove(id: ID) {
    this.movieSearchStore.remove(id);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { MovieSearchResult } from './models/movie-search-results';
import { MovieSearchStore } from './movie-search.store';

@Injectable()
export class MovieSearchService {
  constructor(
    private movieSearchStore: MovieSearchStore,
    private http: HttpClient
  ) {}

  searchMovies(text: string): void {
    const urlToUse = `${environment.tmdbConfig.apiUrl}/search/movie`;
    const params = new HttpParams()
      .set('api_key', environment.tmdbConfig.api_key)
      .set('query', text);

    this.http
      .get(urlToUse, { params })
      .pipe(
        map((response: any) => response.results as MovieSearchResult[]),
        map(data => {
          return data.filter(
            movieSearchResult => !!movieSearchResult.poster_path
          );
        })
      )
      .subscribe(entities => this.movieSearchStore.set(entities));
  }
}

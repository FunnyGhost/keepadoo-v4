import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { Observable } from 'rxjs';
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

  get() {
    this.http
      .get('https://akita.com')
      .subscribe(entities => this.movieSearchStore.set(entities));
  }

  searchMovies(text: string): Observable<MovieSearchResult[]> {
    const urlToUse = `${environment.tmdbConfig.apiUrl}/search/movie`;
    const params = new HttpParams()
      .set('api_key', environment.tmdbConfig.api_key)
      .set('query', text);

    return this.http.get(urlToUse, { params }).pipe(
      map((response: any) => {
        return response.results as MovieSearchResult[];
      }),
      map((data: MovieSearchResult[]) => {
        return data.filter((movieSearchResult: MovieSearchResult) => {
          return !!movieSearchResult.poster_path;
        });
      })
    );
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

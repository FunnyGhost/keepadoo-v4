import { HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '../../../../environments/environment';
import { MovieSearchResult } from './models/movie-search-results';
import { MovieSearchService } from './movie-search.service';
import { MovieSearchStore } from './movie-search.store';

describe('MovieSearchService', () => {
  let movieSearchService: MovieSearchService;
  let movieSearchStore: MovieSearchStore;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieSearchService, MovieSearchStore],
      imports: [HttpClientTestingModule]
    });

    movieSearchService = TestBed.get(MovieSearchService);
    movieSearchStore = TestBed.get(MovieSearchStore);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(movieSearchService).toBeDefined();
  });

  describe('searchMovies', () => {
    it('should get movie search results from tmdb and put them in the store', inject(
      [MovieSearchService],
      (service: MovieSearchService) => {
        const searchText = 'Thor';
        const dataToReturn = {
          results: [
            {
              title: 'Thor',
              overview: 'Something about a greek god..'
            } as MovieSearchResult,
            {
              title: 'Iron man',
              overview: 'Something about a dude with an iron suit..'
            } as MovieSearchResult
          ]
        };

        service.searchMovies(searchText).subscribe();

        const req = httpTestingController.expectOne(
          (request: HttpRequest<any>) => {
            const containsUrl = request.url.includes(
              environment.tmdbConfig.apiUrl
            );
            const containsKey =
              request.params.get('api_key') === environment.tmdbConfig.api_key;
            const containesSearchQuery =
              request.params.get('query') === searchText;
            return containsUrl && containsKey && containesSearchQuery;
          }
        );

        expect(req.request.method).toEqual('GET');

        req.flush(dataToReturn);
        httpTestingController.verify();
      }
    ));

    it('should filter movie search results without a poster from tmdb', (done: any) => {
      inject([MovieSearchService], (service: MovieSearchService) => {
        const searchText = 'Thor';
        const dataToReturn = {
          results: [
            {
              title: 'Thor',
              overview: 'Something about a greek god..',
              poster_path: 'thor-poster'
            } as MovieSearchResult,
            {
              title: 'Iron man',
              overview: 'Something about a dude with an iron suit..',
              poster_path: 'iron-man-poster'
            } as MovieSearchResult,
            {
              title: 'Chinese Iron Man',
              overview: 'Something about a chinese dude with an iron suit..',
              poster_path: ''
            } as MovieSearchResult
          ]
        };

        service
          .searchMovies(searchText)
          .subscribe((searchResults: MovieSearchResult[]) => {
            expect(searchResults).toEqual([
              dataToReturn.results[0],
              dataToReturn.results[1]
            ]);
            done();
          });

        const req = httpTestingController.expectOne(
          (request: HttpRequest<any>) => {
            const containsUrl = request.url.includes(
              environment.tmdbConfig.apiUrl
            );
            const containsKey =
              request.params.get('api_key') === environment.tmdbConfig.api_key;
            const containesSearchQuery =
              request.params.get('query') === searchText;
            return containsUrl && containsKey && containesSearchQuery;
          }
        );

        expect(req.request.method).toEqual('GET');

        req.flush(dataToReturn);
        httpTestingController.verify();
      })();
    });
  });
});

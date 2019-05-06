import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MovieSearchService } from './movie-search.service';
import { MovieSearchStore } from './movie-search.store';

describe('MovieSearchService', () => {
  let movieSearchService: MovieSearchService;
  let movieSearchStore: MovieSearchStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieSearchService, MovieSearchStore],
      imports: [HttpClientTestingModule]
    });

    movieSearchService = TestBed.get(MovieSearchService);
    movieSearchStore = TestBed.get(MovieSearchStore);
  });

  it('should be created', () => {
    expect(movieSearchService).toBeDefined();
  });
});

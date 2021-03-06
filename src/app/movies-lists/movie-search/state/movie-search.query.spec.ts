import { MovieSearchQuery } from './movie-search.query';
import { MovieSearchStore } from './movie-search.store';

describe('MovieSearchQuery', () => {
  let query: MovieSearchQuery;

  beforeEach(() => {
    query = new MovieSearchQuery(new MovieSearchStore());
  });

  test('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});

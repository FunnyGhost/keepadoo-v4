import { MoviesQuery } from './movies.query';
import { MoviesStore } from './movies.store';

describe('MoviesQuery', () => {
  let query: MoviesQuery;

  beforeEach(() => {
    query = new MoviesQuery(new MoviesStore());
  });

  test('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});

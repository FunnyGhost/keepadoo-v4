import { MoviesListsQuery } from './movies-lists.query';
import { MoviesListsStore } from './movies-lists.store';

describe('MoviesListsQuery', () => {
  let query: MoviesListsQuery;

  beforeEach(() => {
    query = new MoviesListsQuery(new MoviesListsStore());
  });

  test('should create an instance', () => {
    expect(query).toBeTruthy();
  });
});

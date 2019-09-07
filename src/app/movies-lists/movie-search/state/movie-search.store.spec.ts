import { MovieSearchStore } from './movie-search.store';

describe('MovieSearchStore', () => {
  let store: MovieSearchStore;

  beforeEach(() => {
    store = new MovieSearchStore();
  });

  test('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});

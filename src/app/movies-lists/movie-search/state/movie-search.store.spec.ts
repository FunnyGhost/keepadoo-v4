import { MovieSearchStore } from './movie-search.store';

describe('MovieSearchStore', () => {
  let store: MovieSearchStore;

  beforeEach(() => {
    store = new MovieSearchStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});

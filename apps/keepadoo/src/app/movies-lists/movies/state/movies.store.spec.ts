import { MoviesStore } from './movies.store';

describe('MoviesStore', () => {
  let store: MoviesStore;

  beforeEach(() => {
    store = new MoviesStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});

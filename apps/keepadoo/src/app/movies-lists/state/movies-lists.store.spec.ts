import { MoviesListsStore } from './movies-lists.store';

describe('MoviesListsStore', () => {
  let store: MoviesListsStore;

  beforeEach(() => {
    store = new MoviesListsStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });
});

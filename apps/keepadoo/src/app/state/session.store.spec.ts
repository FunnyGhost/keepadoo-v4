import { testUser } from '../../test-utilities/test-objects';
import { SessionStore } from './session.store';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore();
  });

  it('should create an instance', () => {
    expect(store).toBeTruthy();
  });

  it('should update the store on login', () => {
    jest.spyOn(store, 'update');

    const inputUser = testUser;
    store.login(inputUser);

    expect(store.update).toHaveBeenCalled();
  });
});

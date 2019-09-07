import { testUser } from '../../test-utilities/test-objects';
import { createInitialState } from './models/session-state';
import { SessionStore } from './session.store';

describe('SessionStore', () => {
  let store: SessionStore;

  beforeEach(() => {
    store = new SessionStore();
  });

  test('should create an instance', () => {
    expect(store).toBeTruthy();
  });

  test('should update the store on login', () => {
    jest.spyOn(store, 'update');

    const inputUser = testUser;
    store.login(inputUser);

    expect(store.update).toHaveBeenCalledWith({ user: inputUser });
  });

  describe('logout', () => {
    test('should reset the session state', () => {
      jest.spyOn(store, 'update');

      store.logout();

      expect(store.update).toHaveBeenCalledWith(createInitialState());
    });
  });
});

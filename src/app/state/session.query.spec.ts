import { testUser } from '../../test-utilities/test-objects';
import { createInitialState } from './models/session-state';
import { SessionQuery } from './session.query';
import { SessionStore } from './session.store';

describe('SessionQuery', () => {
  let query: SessionQuery;
  const store = new SessionStore();

  beforeEach(() => {
    query = new SessionQuery(store);
  });

  test('should create an instance', () => {
    expect(query).toBeTruthy();
  });

  describe('isLoggedIn$', () => {
    test('should return true if there is a user', (done) => {
      store.update({ user: testUser });

      query.isLoggedIn$.subscribe((data: boolean) => {
        expect(data).toBe(true);
        done();
      });
    });

    test('should return false if there is no user', (done) => {
      store.update({ user: null });

      query.isLoggedIn$.subscribe((data: boolean) => {
        expect(data).toBe(false);
        done();
      });
    });
  });

  describe('loggedInUser$', () => {
    test('should return the logged in user display name', (done) => {
      store.update({ user: testUser });

      query.loggedInUser$.subscribe((data: string) => {
        expect(data).toBe(`${testUser.displayName}`);
        done();
      });
    });
  });

  describe('userId$', () => {
    test('should return the logged in userId', (done) => {
      store.update({ user: testUser });

      query.userId$.subscribe((data: string) => {
        expect(data).toBe(`${testUser.userId}`);
        done();
      });
    });
  });

  describe('isLoggedIn', () => {
    test('should return true if the user is logged in', () => {
      store.update({ user: testUser });

      const result = query.isLoggedIn();
      expect(result).toBe(true);
    });

    test('should return false if the user is not logged in', () => {
      store.update({ user: null });

      const result = query.isLoggedIn();
      expect(result).toBe(false);
    });
  });

  describe('redirectUrl', () => {
    test('should return the redirectUrl', () => {
      const inputRedirectUrl = 'home';
      store.update({ redirectUrl: inputRedirectUrl });

      const result = query.redirectUrl();
      expect(result).toBe(inputRedirectUrl);
    });

    test('should return empty string if the redirectUrl was not set', () => {
      store.update(createInitialState());

      const result = query.redirectUrl();
      expect(result).toBe('');
    });
  });

  describe('userId', () => {
    test('should return the current user id', () => {
      store.update({ user: testUser });

      const result = query.userId();
      expect(result).toBe(testUser.userId);
    });

    test('should throw if the user is not logged in', () => {
      store.update(createInitialState());

      expect(() => query.userId()).toThrow();
    });
  });
});

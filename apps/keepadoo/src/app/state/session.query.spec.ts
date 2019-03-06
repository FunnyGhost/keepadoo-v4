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

  it('should create an instance', () => {
    expect(query).toBeTruthy();
  });

  describe('isLoggedIn$', () => {
    it('should return true if there is a user', done => {
      store.update({ user: testUser });

      query.isLoggedIn$.subscribe((data: boolean) => {
        expect(data).toBe(true);
        done();
      });
    });

    it('should return false if there is no user', done => {
      store.update({ user: null });

      query.isLoggedIn$.subscribe((data: boolean) => {
        expect(data).toBe(false);
        done();
      });
    });
  });

  describe('loggedInUser$', () => {
    it('should return the logged in user display name', done => {
      store.update({ user: testUser });

      query.loggedInUser$.subscribe((data: string) => {
        expect(data).toBe(`${testUser.displayName}`);
        done();
      });
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if the user is logged in', () => {
      store.update({ user: testUser });

      const result = query.isLoggedIn();
      expect(result).toBe(true);
    });

    it('should return false if the user is not logged in', () => {
      store.update({ user: null });

      const result = query.isLoggedIn();
      expect(result).toBe(false);
    });
  });

  describe('redirectUrl', () => {
    it('should return the redirectUrl', () => {
      const inputRedirectUrl = 'home';
      store.update({ redirectUrl: inputRedirectUrl });

      const result = query.redirectUrl();
      expect(result).toBe(inputRedirectUrl);
    });

    it('should return empty string if the redirectUrl was not set', () => {
      store.update(createInitialState());

      const result = query.redirectUrl();
      expect(result).toBe('');
    });
  });

  describe('userId', () => {
    it('should return the current user id', () => {
      store.update({ user: testUser });

      const result = query.userId();
      expect(result).toBe(testUser.userId);
    });

    it('should throw if the user is not logged in', () => {
      store.update(createInitialState());

      expect(() => query.userId()).toThrow();
    });
  });
});

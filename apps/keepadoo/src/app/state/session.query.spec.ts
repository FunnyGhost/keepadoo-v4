import { testUser } from '../../test-utilities/test-objects';
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
});

import { testUser } from '../../../test-utilities/test-objects';
import {
  createInitialState,
  createSession,
  SessionState
} from './session-state';
import { User } from './user';

describe('SessionState', () => {
  describe('createInitialState', () => {
    const initialSessionState: SessionState = createInitialState();

    it('should set the user to null', () => {
      expect(initialSessionState.user).toBeNull();
    });

    it('should set the redirectUrl to empty string', () => {
      expect(initialSessionState.redirectUrl).toBe('');
    });
  });

  describe('createSession', () => {
    it('should create a session with the given user', () => {
      const inputUser = testUser;
      const result: User = createSession(inputUser);
      expect(result).toEqual(inputUser);
    });
  });
});

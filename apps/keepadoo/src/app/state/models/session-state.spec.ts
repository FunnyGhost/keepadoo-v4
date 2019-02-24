import {
  createInitialState,
  createSession,
  SessionState
} from './session-state';
import { User } from './user';

describe('SessionState', () => {
  describe('createInitialState', () => {
    it('should set the user to null', () => {
      const initialSessionState: SessionState = createInitialState();
      expect(initialSessionState.user).toBeNull();
    });
  });

  describe('createSession', () => {
    it('should create a session with the given user', () => {
      const inputUser: User = {
        firstName: 'Bruce',
        lastName: 'Wayne',
        token: 'BATMAN'
      };
      const result: User = createSession(inputUser);
      expect(result).toEqual(inputUser);
    });
  });
});

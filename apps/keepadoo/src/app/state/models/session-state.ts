import { User } from './user';

export interface SessionState {
  user: User | null;
}

export function createInitialState(): SessionState {
  return {
    user: null
  };
}

export function createSession(user: User): User {
  return { ...user };
}

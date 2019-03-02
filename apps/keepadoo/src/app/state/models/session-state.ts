import { User } from './user';

export interface SessionState {
  user: User | null;
  redirectUrl: string;
}

export function createInitialState(): SessionState {
  return {
    user: null,
    redirectUrl: ''
  };
}

export function createSession(user: User): User {
  return { ...user };
}

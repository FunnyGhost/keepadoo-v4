import { Injectable } from '@angular/core';
import { Query, toBoolean } from '@datorama/akita';
import { filter, map } from 'rxjs/operators';
import { SessionState } from './models/session-state';
import { SessionStore } from './session.store';

@Injectable({ providedIn: 'root' })
export class SessionQuery extends Query<SessionState> {
  isLoggedIn$ = this.select(({ user }) => toBoolean(user));
  userId$ = this.select(({ user }) => user && user.userId);

  loggedInUser$ = this.select().pipe(
    filter(({ user }) => toBoolean(user)),
    map(({ user: { displayName } }) => `${displayName}`)
  );

  constructor(protected store: SessionStore) {
    super(store);
  }

  isLoggedIn(): boolean {
    return toBoolean(this.getValue().user);
  }

  redirectUrl(): string {
    return this.getValue().redirectUrl;
  }

  userId(): string {
    const user = this.getValue().user;
    if (user) {
      return user.userId;
    }

    throw new Error('User not logged in');
  }
}

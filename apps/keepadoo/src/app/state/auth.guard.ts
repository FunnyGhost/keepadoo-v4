import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionQuery } from './session.query';
import { SessionStore } from './session.store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private sessionQuery: SessionQuery,
    private sessionStore: SessionStore,
    private router: Router
  ) {}

  canActivate(): boolean {
    const isUserLoggedIn = this.sessionQuery.isLoggedIn();

    if (!isUserLoggedIn) {
      this.sessionStore.update({ redirectUrl: this.router.url });
      this.router.navigateByUrl('/login');
      return false;
    }
    return isUserLoggedIn;
  }
}

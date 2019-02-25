import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionQuery } from './session.query';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private sessionQuery: SessionQuery, private router: Router) {}

  canActivate(): boolean {
    const isUserLoggedIn = this.sessionQuery.isLoggedIn();

    if (!isUserLoggedIn) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return isUserLoggedIn;
  }
}

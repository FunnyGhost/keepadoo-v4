import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SessionQuery } from './session.query';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private sessionQuery: SessionQuery) {}

  canActivate(): boolean {
    const isUserLoggedIn = this.sessionQuery.isLoggedIn();

    return isUserLoggedIn;
  }
}

import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import {
  routerMock,
  sessionQueryMock,
  sessionStoreMock
} from '../../test-utilities/test-mocks';
import { AuthGuard } from './auth.guard';
import { SessionQuery } from './session.query';
import { SessionStore } from './session.store';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let query: SessionQuery;
  let store: SessionStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionQuery, useValue: sessionQueryMock },
        { provide: SessionStore, useValue: sessionStoreMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.get(AuthGuard);
    query = TestBed.get(SessionQuery);
    store = TestBed.get(SessionStore);
  });

  it('should return true if the user is logged in', () => {
    jest.spyOn(query, 'isLoggedIn').mockReturnValue(true);

    const result = guard.canActivate(null, {
      url: 'some-url-here'
    } as RouterStateSnapshot);
    expect(result).toBe(true);
  });

  describe('NotLoggedIn', () => {
    beforeEach(function() {
      jest.spyOn(query, 'isLoggedIn').mockReturnValue(false);
    });

    it('should return false if the user is not logged in', () => {
      const result = guard.canActivate(null, {
        url: 'some-url-here'
      } as RouterStateSnapshot);
      expect(result).toBe(false);
    });

    it('should redirect to login if the user is not logged in', () => {
      const router: Router = TestBed.get(Router);

      guard.canActivate(null, { url: 'some-url-here' } as RouterStateSnapshot);

      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });

    it('should set the redirectUrl in the store', () => {
      const urlToUse = 'some-url-here';
      guard.canActivate(null, { url: urlToUse } as RouterStateSnapshot);

      expect(store.update).toHaveBeenCalledWith({
        redirectUrl: urlToUse
      });
    });
  });
});

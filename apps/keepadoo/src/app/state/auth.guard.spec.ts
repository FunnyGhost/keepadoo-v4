import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { routerMock, sessionQueryMock } from '../../test-utilities/test-mocks';
import { AuthGuard } from './auth.guard';
import { SessionQuery } from './session.query';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let query: SessionQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionQuery, useValue: sessionQueryMock },
        { provide: Router, useValue: routerMock }
      ]
    });

    guard = TestBed.get(AuthGuard);
    query = TestBed.get(SessionQuery);
  });

  it('should return true if the user is logged in', () => {
    jest.spyOn(query, 'isLoggedIn').mockReturnValue(true);

    const result = guard.canActivate();
    expect(result).toBe(true);
  });

  it('should return false if the user is not logged in', () => {
    jest.spyOn(query, 'isLoggedIn').mockReturnValue(false);

    const result = guard.canActivate();
    expect(result).toBe(false);
  });

  it('should redirect to login if the user is not logged in', () => {
    const router: Router = TestBed.get(Router);
    jest.spyOn(router, 'navigateByUrl');
    jest.spyOn(query, 'isLoggedIn').mockReturnValue(false);

    guard.canActivate();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
  });
});

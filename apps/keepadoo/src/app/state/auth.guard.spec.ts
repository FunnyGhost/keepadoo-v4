import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { SessionQuery } from './session.query';

const sessionQueryMock = {
  isLoggedIn() {}
};

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let query: SessionQuery;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionQuery, useValue: sessionQueryMock }
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
});

import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  routerMock,
  sessionQueryMock,
  sessionStoreMock
} from '../../test-utilities/test-mocks';
import { testFirebaseUser, testUser } from '../../test-utilities/test-objects';
import { AuthService } from './auth.service';
import { SessionQuery } from './session.query';
import { SessionStore } from './session.store';

const angularFireAuthMock = {
  authState: new Subject<any>(),
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    signOut: jest.fn()
  }
};

describe('AuthService', () => {
  let service: AuthService;
  let store: SessionStore;
  let query: SessionQuery;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SessionStore,
          useValue: sessionStoreMock
        },
        {
          provide: SessionQuery,
          useValue: sessionQueryMock
        },
        {
          provide: AngularFireAuth,
          useValue: angularFireAuthMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    });

    service = TestBed.get(AuthService);
    store = TestBed.get(SessionStore);
    query = TestBed.get(SessionQuery);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Listening for the current user', () => {
    it('should login when a new user is emited by firestore', () => {
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.login).toHaveBeenCalledWith(testUser);
    });

    it('should redirect to the storedRedirectURL when the user logs in', () => {
      const redirectUrl = 'i-am-batman';
      jest.spyOn(query, 'redirectUrl').mockReturnValue(redirectUrl);
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.login).toHaveBeenCalledWith(testUser);
      expect(router.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
    });

    it('should not redirect to the storedRedirectURL when the user logs out', () => {
      const redirectUrl = 'i-am-batman';
      jest.spyOn(query, 'redirectUrl').mockReturnValue(redirectUrl);
      angularFireAuthMock.authState.next(null);

      expect(router.navigateByUrl).not.toHaveBeenCalledWith(redirectUrl);
    });

    it('should logout when the firebase user is not there', () => {
      angularFireAuthMock.authState.next(null);

      expect(store.logout).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in with email and password', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signIn(inputEmail, inputPassword);
      expect(
        angularFireAuthMock.auth.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(inputEmail, inputPassword);
    });

    it('should set loading when waiting for authentication', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signIn(inputEmail, inputPassword);

      expect(store.setLoading).toHaveBeenCalledWith(true);
      expect(store.setLoading).toHaveBeenLastCalledWith(false);
      expect(
        angularFireAuthMock.auth.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(inputEmail, inputPassword);
    });

    it('should unset loading when authentication is finished', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signIn(inputEmail, inputPassword);
      expect(
        angularFireAuthMock.auth.signInWithEmailAndPassword
      ).toHaveBeenCalledWith(inputEmail, inputPassword);
    });

    it('should not set error when authentication is ok', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      angularFireAuthMock.auth.signInWithEmailAndPassword.mockReturnValueOnce(
        {}
      );
      await service.signIn(inputEmail, inputPassword);

      expect(store.setError).not.toHaveBeenCalled();
    });

    it('should set error when authentication fails', async () => {
      const errorToUse = 'Invalid username/password';
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';
      angularFireAuthMock.auth.signInWithEmailAndPassword.mockRejectedValue({
        message: errorToUse
      });

      await service.signIn(inputEmail, inputPassword);

      expect(store.setError).toHaveBeenCalledWith(errorToUse);
    });

    it('should unset loading when there is an error', async () => {
      const errorToUse = 'Invalid username/password';
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';
      angularFireAuthMock.auth.signInWithEmailAndPassword.mockRejectedValue(
        errorToUse
      );

      await service.signIn(inputEmail, inputPassword);

      expect(store.setLoading).toHaveBeenLastCalledWith(false);
    });
  });

  describe('signOut', () => {
    it('should sign out', async () => {
      await service.signOut();

      expect(angularFireAuthMock.auth.signOut).toHaveBeenCalled();
    });

    it('should navigate to the empty route', async () => {
      await service.signOut();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  afterEach(() => {
    sessionStoreMock.login.mockClear();
    angularFireAuthMock.auth.signInWithEmailAndPassword.mockClear();
    angularFireAuthMock.auth.signOut.mockClear();
    routerMock.navigate.mockClear();
    routerMock.navigateByUrl.mockClear();
  });
});

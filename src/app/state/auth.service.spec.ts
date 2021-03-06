import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { routerMock, sessionQueryMock, sessionStoreMock } from '../../test-utilities/test-mocks';
import { testFirebaseUser, testUser } from '../../test-utilities/test-objects';
import { AuthService } from './auth.service';
import { SessionQuery } from './session.query';
import { SessionStore } from './session.store';

const angularFireAuthMock = {
  authState: new Subject<any>(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn()
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

    service = TestBed.inject(AuthService);
    store = TestBed.inject(SessionStore);
    query = TestBed.inject(SessionQuery);
    router = TestBed.inject(Router);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Listening for the current user', () => {
    test('should set loading when starting up', () => {
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.setLoading).toHaveBeenCalledWith(true);
    });

    test('should login when a new user is emitted by firestore', () => {
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.login).toHaveBeenCalledWith(testUser);
    });

    test('should unset loading after init with a logged in user', () => {
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.setLoading).toHaveBeenCalledWith(false);
    });

    test('should redirect to the storedRedirectURL when the user logs in', () => {
      const redirectUrl = 'i-am-batman';
      jest.spyOn(query, 'redirectUrl').mockReturnValue(redirectUrl);
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.login).toHaveBeenCalledWith(testUser);
      expect(router.navigateByUrl).toHaveBeenCalledWith(redirectUrl);
    });

    test('should not redirect to the storedRedirectURL when the user logs out', () => {
      const redirectUrl = 'i-am-batman';
      jest.spyOn(query, 'redirectUrl').mockReturnValue(redirectUrl);
      angularFireAuthMock.authState.next(null);

      expect(router.navigateByUrl).not.toHaveBeenCalledWith(redirectUrl);
    });

    test('should logout when the firebase user is not there', () => {
      angularFireAuthMock.authState.next(null);

      expect(store.logout).toHaveBeenCalled();
    });

    test('should unset loading after init with user that is not logged in', () => {
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('signIn', () => {
    test('should sign in with email and password', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signIn(inputEmail, inputPassword);
      expect(angularFireAuthMock.signInWithEmailAndPassword).toHaveBeenCalledWith(
        inputEmail,
        inputPassword
      );
    });

    test('should set loading when waiting for authentication', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signIn(inputEmail, inputPassword);

      expect(store.setLoading).toHaveBeenCalledWith(true);
      expect(store.setLoading).toHaveBeenCalledWith(false);
    });

    test('should not set error when authentication is ok', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      angularFireAuthMock.signInWithEmailAndPassword.mockReturnValueOnce({});
      await service.signIn(inputEmail, inputPassword);

      expect(store.setError).not.toHaveBeenCalled();
    });

    test('should set error when authentication fails', async () => {
      const errorToUse = 'Invalid username/password';
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';
      angularFireAuthMock.signInWithEmailAndPassword.mockRejectedValue({
        message: errorToUse
      });

      await service.signIn(inputEmail, inputPassword);

      expect(store.setError).toHaveBeenCalledWith(errorToUse);
    });

    test('should unset loading when there is an error', async () => {
      const errorToUse = 'Invalid username/password';
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';
      angularFireAuthMock.signInWithEmailAndPassword.mockRejectedValue(errorToUse);

      await service.signIn(inputEmail, inputPassword);

      expect(store.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('signUp', () => {
    test('should sign up with email and password', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signUp(inputEmail, inputPassword);
      expect(angularFireAuthMock.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        inputEmail,
        inputPassword
      );
    });

    test('should set loading when waiting for user creation', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      await service.signUp(inputEmail, inputPassword);

      expect(store.setLoading).toHaveBeenCalledWith(true);
      expect(store.setLoading).toHaveBeenCalledWith(false);
    });

    test('should not set error when user creation is ok', async () => {
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';

      angularFireAuthMock.createUserWithEmailAndPassword.mockReturnValueOnce({});
      await service.signUp(inputEmail, inputPassword);

      expect(store.setError).not.toHaveBeenCalled();
    });

    test('should set error when user creation fails', async () => {
      const errorToUse = 'Invalid username/password';
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';
      angularFireAuthMock.createUserWithEmailAndPassword.mockRejectedValue({
        message: errorToUse
      });

      await service.signUp(inputEmail, inputPassword);

      expect(store.setError).toHaveBeenCalledWith(errorToUse);
    });

    test('should unset loading when there is an error', async () => {
      const errorToUse = 'Invalid username/password';
      const inputEmail = 'test@test.com';
      const inputPassword = 'password';
      angularFireAuthMock.createUserWithEmailAndPassword.mockRejectedValue(errorToUse);

      await service.signUp(inputEmail, inputPassword);

      expect(store.setLoading).toHaveBeenCalledWith(false);
    });
  });

  describe('signOut', () => {
    test('should sign out', async () => {
      await service.signOut();

      expect(angularFireAuthMock.signOut).toHaveBeenCalled();
    });

    test('should navigate to the login route', async () => {
      await service.signOut();

      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  afterEach(() => {
    sessionStoreMock.login.mockClear();
    angularFireAuthMock.signInWithEmailAndPassword.mockClear();
    angularFireAuthMock.createUserWithEmailAndPassword.mockClear();
    angularFireAuthMock.signOut.mockClear();
    routerMock.navigate.mockClear();
    routerMock.navigateByUrl.mockClear();
    (store as any).setLoading.mockClear();
    (store as any).setError.mockClear();
  });
});

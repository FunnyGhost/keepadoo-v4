import { TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { routerMock, sessionStoreMock } from '../../test-utilities/test-mocks';
import { testFirebaseUser, testUser } from '../../test-utilities/test-objects';
import { AuthService } from './auth.service';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: SessionStore,
          useValue: sessionStoreMock
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Listening for the current user', () => {
    it('should login when a new user is emited by firestore', () => {
      angularFireAuthMock.authState.next(testFirebaseUser);

      expect(store.login).toHaveBeenCalledWith(testUser);
    });

    it('should login with null when the firebase user is not there', () => {
      angularFireAuthMock.authState.next(null);

      expect(store.login).toHaveBeenCalledWith(null);
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
  });
});

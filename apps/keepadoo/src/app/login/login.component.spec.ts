import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { authServiceMock } from '../../test-utilities/test-mocks';
import { AuthService } from '../state/auth.service';
import { SessionQuery } from '../state/session.query';
import { LoginComponent } from './login.component';

const queryMock = {
  error: new BehaviorSubject<string | null>(null),
  selectError(): Observable<string | null> {
    return this.error.asObservable();
  },
  loading: new BehaviorSubject<boolean>(false),
  selectLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        },
        {
          provide: SessionQuery,
          useValue: queryMock
        }
      ]
    })
      .overrideComponent(LoginComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login the user', () => {
    const emailToUse = 'batman@gotham.dc';
    const passwordToUse = 'HahahHahAHha';
    const emailInput = fixture.debugElement.query(By.css('input[type=email]'));
    const passwordInput = fixture.debugElement.query(
      By.css('input[type=password]')
    );
    const loginButton = fixture.debugElement.query(By.css('button'));

    emailInput.nativeElement.value = emailToUse;
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.value = passwordToUse;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    loginButton.triggerEventHandler('click', null);

    expect(authService.signIn).toHaveBeenLastCalledWith(
      emailToUse,
      passwordToUse
    );
  });

  describe('email', () => {
    let errors = {};
    let email: AbstractControl;

    beforeEach(() => {
      errors = {};
      email = component.loginForm.controls['email'];
    });

    it('should be invalid if empty', () => {
      expect(email.valid).toBeFalsy();

      errors = email.errors || {};

      expect(errors['required']).toBeTruthy();
    });

    it('should be invalid if value is not an email', () => {
      email.setValue('test');
      errors = email.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['email']).toBeTruthy();
    });

    it('should be valid if value is an email', () => {
      email.setValue('test@example.com');
      errors = email.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['email']).toBeFalsy();
    });
  });

  describe('password', () => {
    let errors = {};
    let password: AbstractControl;

    beforeEach(() => {
      errors = {};
      password = component.loginForm.controls['password'];
    });

    it('should be invalid if empty', () => {
      expect(password.valid).toBeFalsy();

      errors = password.errors || {};
      expect(errors['required']).toBeTruthy();
    });

    it('should be invalid if value is less than 8 characters long', () => {
      password.setValue('test');
      errors = password.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['minlength']).toBeTruthy();
    });

    it('should be valid if value is an email', () => {
      password.setValue('somelongpassword');
      errors = password.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['minlength']).toBeFalsy();
    });
  });

  describe('LoginButton', () => {
    it('should be enabled if the form is valid', () => {
      const email = component.loginForm.controls['email'];
      email.setValue('batman@gotham.dc');
      const password = component.loginForm.controls['password'];
      password.setValue('Hahahahhaahah');

      fixture.detectChanges();
      const loginButton = fixture.debugElement.query(By.css('button'));

      expect(loginButton.nativeElement.disabled).toBeFalsy();
    });

    it('should be disabled if the form is invalid', () => {
      const email = component.loginForm.controls['email'];
      email.setValue('');

      fixture.detectChanges();
      const loginButton = fixture.debugElement.query(By.css('button'));

      expect(loginButton.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('Error', () => {
    it('should not be visible if there is no error', () => {
      queryMock.error.next(null);

      const errorElements = fixture.debugElement.queryAll(By.css('.error'));

      expect(errorElements.length).toBe(0);
    });

    it('should be visible if there is an error', () => {
      const errorToUse = 'Invalid username/password';
      queryMock.error.next(errorToUse);
      fixture.detectChanges();

      const errorElements = fixture.debugElement.queryAll(By.css('.error'));

      expect(errorElements.length).toBe(1);
      expect(errorElements[0].nativeElement.innerHTML).toContain(errorToUse);
    });
  });

  describe('Loading', () => {
    describe('isNotLoading', () => {
      beforeEach(function() {
        queryMock.loading.next(false);
        fixture.detectChanges();
      });

      it('should not show the loading image', () => {
        const loadingImage = fixture.debugElement.queryAll(
          By.css('.loading-image')
        );
        expect(loadingImage.length).toBe(0);
      });

      it('should show the login button text', () => {
        const loginButtonText = fixture.debugElement.queryAll(
          By.css('.login-button-text')
        );
        expect(loginButtonText.length).toBe(1);
      });
    });

    describe('isLoading', () => {
      beforeEach(function() {
        queryMock.loading.next(true);
        fixture.detectChanges();
      });

      it('should show the loading image', () => {
        const loadingImage = fixture.debugElement.queryAll(
          By.css('.loading-image')
        );
        expect(loadingImage.length).toBe(1);
      });

      it('should not show the login button text', () => {
        const loginButtonText = fixture.debugElement.queryAll(
          By.css('.loading-button-text')
        );
        expect(loginButtonText.length).toBe(0);
      });
    });
  });
});

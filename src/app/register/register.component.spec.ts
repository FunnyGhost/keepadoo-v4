import { ChangeDetectionStrategy } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { authServiceMock } from '../../test-utilities/test-mocks';
import { AuthService } from '../state/auth.service';
import { SessionQuery } from '../state/session.query';
import { RegisterComponent } from './register.component';

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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [RegisterComponent],
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
      .overrideComponent(RegisterComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    authService = TestBed.get(AuthService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should register the user', () => {
    const emailToUse = 'batman@gotham.dc';
    const passwordToUse = 'HahahHahAHha';
    const emailInput = fixture.debugElement.query(By.css('input[type=email]'));
    const passwordInput = fixture.debugElement.query(By.css('input[type=password]'));
    const registerButton = fixture.debugElement.query(By.css('button'));

    emailInput.nativeElement.value = emailToUse;
    emailInput.nativeElement.dispatchEvent(new Event('input'));
    passwordInput.nativeElement.value = passwordToUse;
    passwordInput.nativeElement.dispatchEvent(new Event('input'));

    registerButton.triggerEventHandler('click', null);

    expect(authService.signUp).toHaveBeenCalledWith(emailToUse, passwordToUse);
  });

  describe('email', () => {
    let errors = {};
    let email: AbstractControl;

    beforeEach(() => {
      errors = {};
      email = component.registerForm.controls['email'];
    });

    test('should be invalid if empty', () => {
      expect(email.valid).toBeFalsy();

      errors = email.errors || {};

      expect(errors['required']).toBeTruthy();
    });

    test('should be invalid if value is not an email', () => {
      email.setValue('test');
      errors = email.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['email']).toBeTruthy();
    });

    test('should be valid if value is an email', () => {
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
      password = component.registerForm.controls['password'];
    });

    test('should be invalid if empty', () => {
      expect(password.valid).toBeFalsy();

      errors = password.errors || {};
      expect(errors['required']).toBeTruthy();
    });

    test('should be invalid if value is less than 8 characters long', () => {
      password.setValue('test');
      errors = password.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['minlength']).toBeTruthy();
    });

    test('should be valid if value is an email', () => {
      password.setValue('somelongpassword');
      errors = password.errors || {};

      expect(errors['required']).toBeFalsy();
      expect(errors['minlength']).toBeFalsy();
    });
  });

  describe('RegisterButton', () => {
    test('should be enabled if the form is valid', () => {
      const email = component.registerForm.controls['email'];
      email.setValue('batman@gotham.dc');
      const password = component.registerForm.controls['password'];
      password.setValue('Hahahahhaahah');

      fixture.detectChanges();
      const registerButton = fixture.debugElement.query(By.css('button'));

      expect(registerButton.nativeElement.disabled).toBeFalsy();
    });

    test('should be disabled if the form is invalid', () => {
      const email = component.registerForm.controls['email'];
      email.setValue('');

      fixture.detectChanges();
      const registerButton = fixture.debugElement.query(By.css('button'));

      expect(registerButton.nativeElement.disabled).toBeTruthy();
    });
  });

  describe('Error', () => {
    test('should not be visible if there is no error', () => {
      queryMock.error.next(null);

      const errorElements = fixture.debugElement.queryAll(By.css('.error'));

      expect(errorElements.length).toBe(0);
    });

    test('should be visible if there is an error', () => {
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
      beforeEach(() => {
        queryMock.loading.next(false);
        fixture.detectChanges();
      });

      test('should not show the loading image', () => {
        const loadingImage = fixture.debugElement.queryAll(By.css('.loading-image'));
        expect(loadingImage.length).toBe(0);
      });

      test('should show the register button text', () => {
        const registerButtonText = fixture.debugElement.queryAll(By.css('.register-button-text'));
        expect(registerButtonText.length).toBe(1);
      });
    });

    describe('isLoading', () => {
      beforeEach(() => {
        queryMock.loading.next(true);
        fixture.detectChanges();
      });

      test('should show the loading image', () => {
        const loadingImage = fixture.debugElement.queryAll(By.css('.loading-image'));
        expect(loadingImage.length).toBe(1);
      });

      test('should not show the register button text', () => {
        const registerButtonText = fixture.debugElement.queryAll(By.css('.loading-button-text'));
        expect(registerButtonText.length).toBe(0);
      });
    });
  });

  test('should have a button to go to the login page', () => {
    const loginButton = fixture.debugElement.query(By.css('.login-button')).nativeElement;

    expect(loginButton.href).toContain('login');
    expect(loginButton.text).toContain('login');
  });
});

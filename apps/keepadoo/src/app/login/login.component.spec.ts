import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { authServiceMock } from '../../test-utilities/test-mocks';
import { AuthService } from '../state/auth.service';
import { LoginComponent } from './login.component';

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
        }
      ]
    }).compileComponents();
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
});

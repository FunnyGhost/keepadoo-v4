import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../state/auth.service';
import { SessionQuery } from '../state/session.query';

@Component({
  selector: 'keepadoo-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  registerForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.required]]
  });

  error$: Observable<string>;
  loading$: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private query: SessionQuery
  ) {}

  ngOnInit() {
    this.error$ = this.query.selectError();
    this.loading$ = this.query.selectLoading();
  }

  onSubmit(): void {
    this.authService.signUp(
      this.registerForm.value.email,
      this.registerForm.value.password
    );
  }
}

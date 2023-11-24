import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

/**
 * This component displays a loading spinner over a block of content,
 * in a dimmed overlay. Content inside the component is projected,
 * and a boolean Input `loading` displays the spinner at will.
 * Projected content is blocked from interaction when `loading`
 * is set to `true`
 *
 * Usage example:
 * @example
 * <app-loader [loading]="loading">
 *   <div>
 *      Content goes here
 *   </div>
 *   <button (click)="loading = true; getContent()">
 *     Get new content
 *   </button>
 * </app-loader>
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginError: string = '';
  isLoggedIn: boolean = false;
  submitted = false;
  returnUrl: string = '/home';
  loginForm: FormGroup;
  email: String = '';

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private storageService: StorageService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.loginForm = this.formBuilder.group({
      email: new FormControl('admin@example.com', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('admin123', Validators.required),
    });
  }

  //   get f() {
  //   return this.loginForm.controls;
  // }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    console.log('this.loginForm.getRawValue()');
    console.log(this.loginForm.getRawValue());
    const { email, password } = this.loginForm.getRawValue();

    this.authService.loginUser(email, password).subscribe(
      (response) => {
        localStorage.setItem('authToken', response.token);
        this.appService.setUserLoggedIn(true);
        this.router.navigate([this.returnUrl]);
      },
      (error) => {
        this.handleLoginError(error.status);
      }
    );
  }

  private handleLoginError(status: number) {
    switch (status) {
      case 404:
        this.loginError =
          "Please check your email or sign up if you don't have an account.";
        break;
      case 401:
        this.loginError =
          'Incorrect password. Please verify your password and try again.';
        break;
      case 500:
        this.loginError = 'Request failed. Please try again later.';
        break;
      default:
        this.loginError =
          'An unexpected error occurred. Please try again later or contact support.';
        break;
    }
  }
}

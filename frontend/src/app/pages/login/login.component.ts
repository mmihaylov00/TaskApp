import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  error: string;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  login() {
    const val = this.form.value;

    this.error = undefined;
    if (this.form.valid) {
      this.authService.login(val).subscribe({
        next: (response) => {
          console.log(response);
          localStorage.setItem('token', response.token);
        },
        error: (err) => {
          this.error = 'Invalid email or password!';
        },
      });
    } else {
      setTimeout(() => {
        this.error = 'Invalid email format';
      }, 1);
    }
  }

  protected readonly environment = environment;
}

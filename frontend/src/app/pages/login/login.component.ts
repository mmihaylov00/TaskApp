import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
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

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
  ) {
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
        next: async (response) => {
          await this.authService.setToken(response);
        },
        error: () => {
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

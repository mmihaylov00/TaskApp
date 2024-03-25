import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { setProfileData } from '../../states/profile.reducer';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-change-password-setup',
  templateUrl: './profile-setup.component.html',
  styleUrls: ['./profile-setup.component.scss'],
})
export class ProfileSetupComponent {
  form: FormGroup;
  error: string;
  passwordVisible = false;
  confirmPasswordVisible = false;

  id: string;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      this.id = params.get('id');
      if (!this.id) {
        await this.router.navigate(['']);
      }
      this.userService.getInvitationData(this.id).subscribe({
        next: (user) => {
          this.form = this.fb.group({
            firstName: [user.firstName || '', Validators.required],
            lastName: [user.lastName || '', Validators.required],
            email: [user.email || '', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
          });
        },
        error: async () => await this.router.navigate(['']),
      });
    });
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  validate(val: any) {
    if (!val.firstName.length) {
      this.error = 'First name is missing!';
      return;
    }
    if (!val.lastName.length) {
      this.error = 'Last name is missing!';
      return;
    }
    if (!val.email.length) {
      this.error = 'E-Mail is missing!';
      return;
    }
    if (!val.password.length) {
      this.error = 'Password is missing!';
      return;
    }
    if (val.password.length < 8) {
      this.error = 'Passwords must be 8 characters long!';
      return;
    }
    if (
      val.password.toLowerCase() === val.password ||
      val.password.toUpperCase() === val.password ||
      val.password.search(/[0-9]/) < 0
    ) {
      this.error =
        'Passwords must contain at least 1 lowercase letter, 1 uppercase letter and 1 digit';
      return;
    }
    if (!val.confirmPassword.length) {
      this.error = 'Confirm password is missing!';
      return;
    }
    if (val.password !== val.confirmPassword) {
      this.error = 'Passwords does not match!';
      return;
    }
  }

  async confirm() {
    const val = this.form.value;
    this.error = undefined;
    this.validate(val);

    if (this.form.valid && !this.error) {
      this.userService
        .setupProfile({ ...val, invitationLink: this.id })
        .subscribe(async (user) => {
          localStorage.setItem('token', user.token);
          this.store.dispatch(setProfileData(user));
          await this.router.navigate(['']);
          location.reload();
        });
    } else {
      setTimeout(() => {
        this.error = 'Invalid E-Mail!';
      }, 1);
    }
  }

  protected readonly environment = environment;
}

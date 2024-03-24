import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  templateUrl: './change-password.modal.html',
  styleUrls: ['./change-password.modal.scss'],
})
export class ChangePasswordModal {
  constructor(
    private readonly dialogRef: MatDialogRef<ChangePasswordModal>,
    private readonly userService: UserService,
  ) {
    this.dialogRef.updateSize('35%', undefined);
  }

  error = undefined;
  success = false;
  oldPasswordControl = new FormControl('', [Validators.required]);
  newPasswordControl = new FormControl('', [Validators.required]);
  confirmPasswordControl = new FormControl('', [Validators.required]);
  visiblePasswords = [false, false, false];

  togglePasswordVisibility(index) {
    this.visiblePasswords[index] = !this.visiblePasswords[index];
  }

  validate(password: string, confirmPassword: string) {
    if (!password?.length) {
      this.error = 'New password is missing!';
      return;
    }
    if (password.length < 8) {
      this.error = 'New password must be 8 characters long!';
      return;
    }
    if (
      password.toLowerCase() === password ||
      password.toUpperCase() === password ||
      password.search(/[0-9]/) < 0
    ) {
      this.error =
        'New password must contain at least 1 lowercase letter, 1 uppercase letter and 1 digit';
      return;
    }
    if (!confirmPassword.length) {
      this.error = 'Confirm password is missing!';
      return;
    }
    if (password !== confirmPassword) {
      this.error = 'Passwords does not match!';
      return;
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.error = undefined;
    this.validate(
      this.newPasswordControl.value,
      this.confirmPasswordControl.value,
    );
    if (this.error) {
      return;
    }

    this.userService
      .updatePassword({
        newPassword: this.newPasswordControl.value,
        oldPassword: this.oldPasswordControl.value,
      })
      .subscribe({
        next: () => {
          this.success = true;
          this.oldPasswordControl.setValue(undefined);
          this.newPasswordControl.setValue(undefined);
          this.confirmPasswordControl.setValue(undefined);
          this.oldPasswordControl.markAsUntouched();
          this.newPasswordControl.markAsUntouched();
          this.confirmPasswordControl.markAsUntouched();
        },
        error: () => (this.error = 'Old password is incorrect!'),
      });
  }
}

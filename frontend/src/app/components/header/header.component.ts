import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { ProfileData } from '../../states/profile.reducer';
import { toggleNavOpenState } from '../../states/nav.reducer';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ConfirmModal } from '../../modal/confirm/confirm.modal';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordModal } from '../../modal/change-password/change-password.modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly SITE_NAME = environment.siteName;
  username = '';

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService,
  ) {
    this.store
      .pipe(select((value: any) => value.profileData))
      .subscribe((value: ProfileData) => {
        this.username = value.firstName;
      });
  }

  readonly DROPDOWN_ITEMS = [
    {
      icon: 'edit_note',
      title: 'Change Password',
      onClick: () => this.openChangePassword(),
    },
    {
      icon: 'logout',
      title: 'Log out',
      onClick: () => this.authService.logout(),
    },
  ];

  openChangePassword() {
    this.dialog.open(ChangePasswordModal);
  }

  toggleMenu() {
    this.store.dispatch(toggleNavOpenState({}));
  }
}

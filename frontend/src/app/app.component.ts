import { Component, ViewChild } from '@angular/core';
import { UserService } from './services/user.service';
import { Store } from '@ngrx/store';
import { setProfileData } from './states/profile.reducer';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogged = !!localStorage.getItem('token');

  constructor(
    private readonly router: Router,
    readonly userService: UserService,
    readonly store: Store,
  ) {
    this.isInProfile = window.location.pathname === '/profile-setup';
    if (!this.isLogged) return;

    userService.getProfile().subscribe({
      next: async (value) => {
        localStorage.setItem('token', value.token);
        store.dispatch(setProfileData(value));
        if (value.status === UserStatus.INVITED && !this.isInProfile) {
          await this.router.navigate(['profile-setup']);
          this.isInProfile = true;
        }
      },
    });
  }

  isInProfile = false;
}

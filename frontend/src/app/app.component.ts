import { Component, ViewChild } from '@angular/core';
import { UserService } from './services/user.service';
import { select, Store } from '@ngrx/store';
import { setProfileData } from './states/profile.reducer';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { MatSidenav } from '@angular/material/sidenav';
import { NavData } from './states/nav.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogged = !!localStorage.getItem('token');
  navOpen = true;
  taskOpen = false;

  constructor(
    private readonly router: Router,
    readonly userService: UserService,
    readonly store: Store,
  ) {
    this.isInProfile = window.location.pathname === '/profile-setup';
    if (!this.isLogged) return;

    this.store
      .pipe(select((value: any) => value.navData))
      .subscribe(async (value: NavData) => {
        if (!value) return;
        this.navOpen = value.nav;
        this.taskOpen = value.task;
      });

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

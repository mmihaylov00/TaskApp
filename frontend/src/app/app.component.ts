import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { select, Store } from '@ngrx/store';
import { setProfileData } from './states/profile.reducer';
import { Router } from '@angular/router';
import {
  NavData,
  setNavOpenState,
  setTaskOpenState,
} from './states/nav.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogged = !!localStorage.getItem('token');
  navOpen = true;
  taskOpen = false;
  isInProfile = false;

  constructor(
    private readonly router: Router,
    readonly userService: UserService,
    readonly store: Store,
  ) {
    this.isInProfile = window.location.pathname.includes('/invitation/');
    if (!this.isLogged || this.isInProfile) return;

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
      },
    });
  }

  closeNav() {
    this.store.dispatch(setNavOpenState({ isOpen: false }));
  }
  async closeTask() {
    await this.router.navigate([], { replaceUrl: false, queryParams: {} });
    this.store.dispatch(setTaskOpenState({ isOpen: false }));
  }
}

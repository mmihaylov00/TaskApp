import { Component, inject } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { Store } from '@ngrx/store';
import { setProfileData } from './states/profile.reducer';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogged = !!localStorage.getItem('token');

  readonly DROPDOWN_ITEMS = [
    {
      title: 'Profile',
      onClick: () => this.router.navigate(['/profile']),
    },
    {
      title: 'Log out',
      onClick: () => this.authService.logout(),
    },
  ];

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    readonly profileService: ProfileService,
    readonly store: Store,
  ) {
    if (!this.isLogged) return;

    profileService.getProfile().subscribe({
      next: (value) => {
        localStorage.setItem('token', value.token);
        store.dispatch(setProfileData(value));
      },
    });
  }
}

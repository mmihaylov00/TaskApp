import { Component, inject } from '@angular/core';
import { ProfileService } from './services/profile.service';
import { Store } from '@ngrx/store';
import { setProfileData } from './states/profile.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLogged = !!localStorage.getItem('token');

  constructor(readonly profileService: ProfileService, store: Store) {
    if (!this.isLogged) return;

    profileService.getProfile().subscribe({
      next: (value) => {
        localStorage.setItem('token', value.token);
        store.dispatch(setProfileData(value));
      },
    });
  }
}

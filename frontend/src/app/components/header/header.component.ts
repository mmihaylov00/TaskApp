import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { ProfileData } from '../../states/profile.reducer';
import { setNavOpenState } from '../../states/nav.reducer';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly SITE_NAME = environment.siteName;
  username = '';

  constructor(
    private readonly store: Store,
    private readonly router: Router,
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
      icon: 'person',
      title: 'Profile',
      onClick: () => this.router.navigate(['/profile']),
    },
    {
      icon: 'logout',
      title: 'Log out',
      onClick: () => this.authService.logout(),
    },
  ];

  ngOnInit(): void {}

  toggleMenu() {
    this.store.dispatch(setNavOpenState({ isOpen: true }));
  }
}

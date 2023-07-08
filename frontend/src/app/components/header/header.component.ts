import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { ProfileData } from '../../states/profile.reducer';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  readonly SITE_NAME = environment.siteName;
  username = '';

  constructor(store: Store) {
    store
      .pipe(select((value: any) => value.profileData))
      .subscribe((value: ProfileData) => {
        this.username = value.firstName;
      });
  }

  ngOnInit(): void {}
}

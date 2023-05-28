import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: '/side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  readonly pages = [
    {
      name: 'Home',
    },
    {
      name: 'Dashboard',
      icon: 'heroClipboard',
      link: '/',
    },
    {
      name: 'My Tasks',
      icon: 'heroBriefcase',
      link: '/tasks',
    },
    {
      name: 'Administration',
    },
    {
      name: 'Users',
      icon: 'heroUser',
      link: '/users',
    },
    {
      name: 'Teams',
      icon: 'heroUserGroup',
      link: '/teams',
    },
    {
      name: 'Projects',
    },
  ];

  currentRoute = '/';

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      this.currentRoute = event.url;
    });
  }
}

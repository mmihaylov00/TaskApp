import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectModal } from '../../modal/create-project-modal/create-project-modal.component';

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

  projects = [
    {
      id: 'a',
      name: 'Test Project',
      color: 'green',
      link: '/project/a',
      compact: false,
      boards: [
        {
          id: 'b',
          name: 'board',
          isFavourite: true,
          link: '/project/a/board/b',
        },
      ],
    },
    {
      id: 'c',
      name: 'Second Project',
      color: 'black',
      link: '/project/c',
      compact: false,
      boards: [
        {
          id: 'd',
          name: 'Testing',
          color: 'red',
          isFavourite: true,
          link: '/project/c/board/d',
        },
        {
          id: 'e',
          name: 'More boards',
          color: 'cyan',
          isFavourite: false,
          link: '/project/c/board/e',
        },
      ],
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
  ) {}

  createNewProject() {
    this.dialog.open(CreateProjectModal, {});
  }

  toggleProject(id: string) {
    let project = this.projects.find((project) => project.id === id);
    project.compact = !project.compact;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;
      this.currentRoute = event.url;
    });
    setTimeout(() => {
      for (let project of this.projects) {
        let element = document.getElementById(project.id);
        const initialHeight = element.clientHeight + 2;
        element.style.height = initialHeight + 'px';
      }
    }, 1);
  }
}

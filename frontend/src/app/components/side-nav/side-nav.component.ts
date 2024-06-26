import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { select, Store } from '@ngrx/store';
import { ProjectData, setProjectState } from '../../states/project.reducer';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { ProfileData } from '../../states/profile.reducer';
import { CreateProjectModal } from '../../modal/create-project/create-project.modal';

@Component({
  selector: 'app-side-nav',
  templateUrl: '/side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly projectService: ProjectService,
  ) {
    this.store
      .pipe(select((value: any) => value.profileData))
      .subscribe((value: ProfileData) => {
        this.role = value.role;
      });

    this.store
      .pipe(select((value: any) => value.projectData))
      .subscribe((value: ProjectData) => {
        this.favourites = JSON.parse(
          localStorage.getItem('favourites') || '[]',
        );
        this.projects = value.projects.map((project) => {
          return {
            compact: false,
            ...project,
          };
        });
      });
  }

  favourites: string[] = [];
  role = Role.DEVELOPER;

  readonly pages = [
    {
      name: 'Home',
    },
    {
      name: 'Home',
      icon: 'home',
      link: '/',
    },
    {
      name: 'My Tasks',
      icon: 'work',
      link: '/tasks',
    },
    {
      name: 'Administration',
      roles: [Role.ADMIN],
    },
    {
      name: 'Users',
      icon: 'person',
      link: '/users',
      roles: [Role.ADMIN],
    },
  ];

  hasRole(item: { roles: Role[] }) {
    if (!item.roles) return true;
    return item.roles.includes(this.role);
  }

  currentRoute = '/';

  projects: ProjectDto[] = [];

  createNewProject() {
    this.dialog.open(CreateProjectModal, {});
  }

  toggleProject(id: string) {
    const project = this.projects.find((project) => project.id === id);
    project.compact = !project.compact;
    this.store.dispatch(setProjectState({ projects: this.projects }));
  }

  ngOnInit() {
    this.loadProjects();
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

  loadProjects() {
    this.projectService.list(100).subscribe((page) => {
      const projects: ProjectDto[] = page.items.map((project) => {
        return {
          ...project,
          compact:
            this.projects.find((p) => p.id == project.id)?.compact || false,
        };
      });
      this.store.dispatch(setProjectState({ projects }));
    });
  }

  protected readonly Role = Role;
}

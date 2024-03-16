import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectModal } from '../../modal/create-project-modal/create-project-modal.component';
import { ProjectService } from '../../services/project.service';
import { select, Store } from '@ngrx/store';
import { ProjectData, setProjectState } from '../../states/project.reducer';
import { state } from '@angular/animations';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';

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
      .pipe(select((value: any) => value.projectData))
      .subscribe((value: ProjectData) => {
        this.projects = value.projects.map((project) => {
          return {
            compact: false,
            ...project,
          };
        });
      });
  }

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

  projects = [];

  createNewProject() {
    this.dialog.open(CreateProjectModal, {});
  }

  toggleProject(id: string) {
    const project = this.projects.find((project) => project.id === id);
    project.compact = !project.compact;
    this.store.dispatch(setProjectState({ projects: this.projects }));
  }

  ngOnInit(): void {
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
}

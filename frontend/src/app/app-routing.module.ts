import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Route[] = [
  {
    path: '',
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: DashboardComponent,
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: MyTasksComponent,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot([
      ...(!!localStorage.getItem('token') ? routes : []),
      {
        path: '**',
        component: !!localStorage.getItem('token')
          ? NotFoundComponent
          : LoginComponent,
      },
    ]),
  ],
})
export class AppRoutingModule {}

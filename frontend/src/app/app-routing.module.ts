import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';
import { LoginComponent } from './pages/login/login.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        component: !!localStorage.getItem('token')
          ? DashboardComponent
          : LoginComponent,
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

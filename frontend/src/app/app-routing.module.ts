import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        component: DashboardComponent,
        pathMatch: 'full',
      },
      {
        path: '',
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
        component: NotFoundComponent,
      },
    ]),
  ],
})
export class AppRoutingModule {}

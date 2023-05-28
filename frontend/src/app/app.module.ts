import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import {
  heroBell,
  heroMagnifyingGlass,
  heroClipboard,
  heroUser,
  heroUserGroup,
  heroBriefcase,
} from '@ng-icons/heroicons/outline';
import { NgIconsModule } from '@ng-icons/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    DashboardComponent,
    HeaderComponent,
    SideNavComponent,
    MyTasksComponent,
    AvatarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgIconsModule.withIcons({
      heroBell,
      heroMagnifyingGlass,
      heroClipboard,
      heroUser,
      heroUserGroup,
      heroBriefcase,
    }),
    MatSidenavModule,
  ],
  exports: [CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

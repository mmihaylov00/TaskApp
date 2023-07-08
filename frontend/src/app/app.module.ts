import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import {
  heroBell,
  heroBriefcase,
  heroClipboard,
  heroExclamationCircle,
  heroMagnifyingGlass,
  heroUser,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import { heroEyeSlashSolid, heroEyeSolid } from '@ng-icons/heroicons/solid';
import { NgIconsModule } from '@ng-icons/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TaskBoardComponent } from './pages/task-board/task-board.component';
import { LoginComponent } from './pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './guard/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { profileReducer } from './states/profile.reducer';
import { ProfileService } from './services/profile.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    DashboardComponent,
    HeaderComponent,
    SideNavComponent,
    MyTasksComponent,
    AvatarComponent,
    TaskBoardComponent,
    LoginComponent,
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
      heroEyeSolid,
      heroEyeSlashSolid,
      heroExclamationCircle,
    }),
    MatSidenavModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({ profileData: profileReducer }, {}),
  ],
  providers: [
    AuthService,
    ProfileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  exports: [CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

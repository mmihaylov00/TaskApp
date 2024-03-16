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
  heroChevronDown,
  heroClipboard,
  heroExclamationCircle,
  heroMagnifyingGlass,
  heroPlusCircle,
  heroStar,
  heroUser,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';
import {
  heroEyeSlashSolid,
  heroEyeSolid,
  heroSquares2x2Solid,
  heroStarSolid,
} from '@ng-icons/heroicons/solid';
import { NgIconsModule } from '@ng-icons/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyTasksComponent } from './pages/my-tasks/my-tasks.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TaskBoardComponent } from './pages/task-board/task-board.component';
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './guard/auth.interceptor';
import { StoreModule } from '@ngrx/store';
import { profileReducer } from './states/profile.reducer';
import { ProfileService } from './services/profile.service';
import { AuthService } from './services/auth.service';
import { PopupComponent } from './components/popup/popup.component';
import { popupReducer } from './states/popup.reducer';
import { CreateProjectModal } from './modal/create-project-modal/create-project-modal.component';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { projectReducer } from './states/project.reducer';

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
    PopupComponent,
    CreateProjectModal,
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
      heroStar,
      heroStarSolid,
      heroSquares2x2Solid,
      heroPlusCircle,
      heroChevronDown,
    }),
    MatSidenavModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatListModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot(
      {
        profileData: profileReducer,
        popupData: popupReducer,
        projectData: projectReducer,
      },
      {},
    ),
  ],
  providers: [
    AuthService,
    ProfileService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        height: '400px',
        width: '600px',
      },
    },
  ],
  exports: [CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

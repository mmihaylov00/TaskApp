import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
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
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { PopupComponent } from './components/popup/popup.component';
import { popupReducer } from './states/popup.reducer';
import { InviteUserModal } from './modal/invite-user/invite-user.modal';
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
import { ProjectComponent } from './pages/project/project.component';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { TableComponent } from './components/table/table.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateBoardModal } from './modal/create-board/create-board.modal';
import { CardComponent } from './components/card/card.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsersComponent } from './pages/users/users.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { CreateProjectModal } from './modal/create-project/create-project.modal';
import { MatIconModule } from '@angular/material/icon';
import { EditUserModal } from './modal/edit-user/edit-user.modal';
import { ConfirmModal } from './modal/confirm/confirm.modal';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EditProjectModal } from './modal/edit-project/edit-project.modal';
import { AddUserModal } from './modal/add-user/add-user.modal';
import { UserSearchComponent } from './components/user-search/user-search.component';

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
    InviteUserModal,
    CreateProjectModal,
    CreateBoardModal,
    EditUserModal,
    EditProjectModal,
    AddUserModal,
    ConfirmModal,
    ProjectComponent,
    TableComponent,
    CardComponent,
    UsersComponent,
    UserSearchComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    NgxSkeletonLoaderModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  providers: [
    AuthService,
    UserService,
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

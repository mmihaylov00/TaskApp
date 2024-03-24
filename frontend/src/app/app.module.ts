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
import { navReducer } from './states/nav.reducer';
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
import { ManageBoardModal } from './modal/manage-board/manage-board.modal';
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
import { ProfileSetupComponent } from './pages/profile-setup/profile-setup.component';
import { IconSelectComponent } from './components/icon-select/icon-select.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { NgxColorsModule } from 'ngx-colors';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { CustomDateAdapter } from './adapters/custom-date.adapter';
import { NgxEditorModule } from 'ngx-editor';
import { SideTaskComponent } from './components/side-task/side-task.component';
import { boardReducer } from './states/board.reducer';
import { ChangePasswordModal } from './modal/change-password/change-password.modal';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { ChartComponent } from './components/chart/chart.component';
import { PieChartComponent } from './components/chart/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/chart/bar-chart/bar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    DashboardComponent,
    HeaderComponent,
    SideNavComponent,
    SideTaskComponent,
    MyTasksComponent,
    ProfileSetupComponent,
    AvatarComponent,
    TaskBoardComponent,
    LoginComponent,
    InviteUserModal,
    CreateProjectModal,
    ManageBoardModal,
    EditUserModal,
    EditProjectModal,
    ChangePasswordModal,
    AddUserModal,
    ConfirmModal,
    ProjectComponent,
    TableComponent,
    CardComponent,
    UsersComponent,
    UserSearchComponent,
    IconSelectComponent,
    ColorPickerComponent,
    TaskCardComponent,
    ChartComponent,
    PieChartComponent,
    BarChartComponent,
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
        navData: navReducer,
        projectData: projectReducer,
        boardData: boardReducer,
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
    MatChipsModule,
    MatMenuModule,
    NgxColorsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxEditorModule,
    NgApexchartsModule,
  ],
  providers: [
    AuthService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        height: '50%',
        width: '50%',
      },
    },
  ],
  exports: [CommonModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

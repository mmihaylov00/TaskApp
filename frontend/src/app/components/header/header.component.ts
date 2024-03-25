import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';
import { select, Store } from '@ngrx/store';
import { ProfileData } from '../../states/profile.reducer';
import { toggleNavOpenState } from '../../states/nav.reducer';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordModal } from '../../modal/change-password/change-password.modal';
import { FormControl } from '@angular/forms';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  readonly SITE_NAME = environment.siteName;
  username = '';
  searchControl = new FormControl('', []);
  tasks: TaskDto[] = [];
  notificationCount?: number = undefined;
  unreadNotifications: NotificationDto[] = undefined;

  constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly taskService: TaskService,
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService,
  ) {
    this.store
      .pipe(select((value: any) => value.profileData))
      .subscribe((value: ProfileData) => {
        this.username = value.firstName;
      });
    this.loadTasks();
    this.loadNotificationCount();
    this.searchControl.valueChanges.subscribe(
      async (id) => await this.chooseTask(id),
    );
  }

  loadTasks() {
    this.taskService
      .find(this.searchControl.value)
      .subscribe((tasks) => (this.tasks = tasks));
  }

  loadNotificationCount() {
    this.notificationService
      .getCount()
      .subscribe(
        ({ count }) => (this.notificationCount = count > 0 ? count : undefined),
      );
  }

  loadNotifications() {
    this.notificationService.getUnread().subscribe((notifications) => {
      this.unreadNotifications = notifications;
      this.notificationCount = undefined;
    });
  }

  async chooseTask(id: string) {
    const index = this.tasks.findIndex((task) => task.id === id);
    if (index === -1) return;

    await this.router.navigate([], {
      replaceUrl: false,
      queryParams: { task: id },
    });
    this.searchControl.setValue(undefined);
    this.searchControl.disable();
    setTimeout(() => this.searchControl.enable(), 1);
  }

  readonly DROPDOWN_ITEMS = [
    {
      icon: 'edit_note',
      title: 'Change Password',
      onClick: () => this.openChangePassword(),
    },
    {
      icon: 'logout',
      title: 'Log out',
      onClick: () => this.authService.logout(),
    },
  ];

  openChangePassword() {
    this.dialog.open(ChangePasswordModal);
  }

  toggleMenu() {
    this.store.dispatch(toggleNavOpenState({}));
  }

  hasNotifications() {
    return this.unreadNotifications !== undefined;
  }

  async clickNotification(link: string) {
    await this.router.navigate(link.split('/'));
  }
}

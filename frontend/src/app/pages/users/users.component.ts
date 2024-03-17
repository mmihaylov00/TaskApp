import { Component, OnInit } from '@angular/core';
import { ColumnDto } from '../../components/table/dtos/column.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { InviteUserModal } from '../../modal/invite-user/invite-user.modal';
import { EditUserModal } from '../../modal/edit-user/edit-user.modal';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { ConfirmModal } from '../../modal/confirm/confirm.modal';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
  ) {}

  userColumns: ColumnDto[] = [
    { key: 'firstName', header: 'First Name', type: 'text' },
    { key: 'lastName', header: 'Last Name', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' },
    { key: 'role', header: 'Role', type: 'text' },
    { key: 'status', header: 'Status', type: 'text' },
    { key: 'actions', header: '', type: 'slot', width: 25 },
  ];
  userData: Page<UserDetailsDto> = undefined;
  userPage: PageRequestDto = { page: 1, pageAmount: 10 };
  loading = false;

  inviteUser() {
    const dialog = this.dialog.open(InviteUserModal);
    dialog.afterClosed().subscribe((value) => {
      if (value) {
        this.userData = undefined;
        this.loadUsers();
      }
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  changePage(page: number) {
    this.userPage.page = page;
    this.loading = true;
    this.loadUsers();
  }

  loadUsers() {
    console.log('close');
    this.userService.list(this.userPage).subscribe((page) => {
      this.userData = { ...page };
      this.loading = false;
    });
  }

  editUser(user: UserDetailsDto) {
    const dialog = this.dialog.open(EditUserModal, { data: { user } });
    dialog.afterClosed().subscribe((value) => {
      if (value) {
        this.userData = undefined;
        this.loadUsers();
      }
    });
  }

  changeStatus(user: UserDetailsDto) {
    if (user.status === UserStatus.INVITED) return;

    const action = user.status === UserStatus.DISABLED ? 'Activate' : 'Disable';
    const title = `${action} ${user.firstName} ${user.lastName} (${user.email})`;

    const dialog = this.dialog.open(ConfirmModal, {
      data: { title, action: `${action.toLowerCase()} this user` },
    });
    dialog.afterClosed().subscribe((value) => {
      if (value) {
        user.status =
          user.status === UserStatus.ACTIVE
            ? UserStatus.DISABLED
            : UserStatus.ACTIVE;
        this.userService.changeStatus(user.id, user.status).subscribe(() => {
          const index = this.userData.items.findIndex((u) => u.id === user.id);
          this.userData.items.splice(index, 1, user);
        });
      } else {
        this.userData = JSON.parse(JSON.stringify(this.userData));
      }
    });
  }

  protected readonly UserStatus = UserStatus;
}

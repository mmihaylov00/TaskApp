import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { FormControl } from '@angular/forms';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { AddUserModal } from '../../modal/add-user/add-user.modal';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
})
export class UserSearchComponent {
  constructor(
    private readonly store: Store,
    private readonly userService: UserService,
  ) {
    this.loadUsers();
    this.userControl.valueChanges.subscribe((value) => this.chooseUser(value));
  }

  userControl = new FormControl('', []);
  users: UserDetailsDto[] = [];
  selectedUsers: UserDetailsDto[] = [];

  displayUserFunction(user: UserDetailsDto): string {
    if (!user) return '';
    return `${user.firstName} ${user.lastName} (${user.email})`;
  }

  loadUsers() {
    this.userService
      .find(this.userControl.value, this.selectedUsers)
      .subscribe((users) => (this.users = users));
  }

  chooseUser(id) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return;

    this.userControl.setValue('');
    this.selectedUsers.push(this.users[index]);
    this.users.splice(index, 1);
  }

  removeItem(user: UserDetailsDto) {
    const index = this.selectedUsers.findIndex((u) => u.id === user.id);
    const removedUser = this.selectedUsers.splice(index, 1);
    this.users.splice(0, 0, ...removedUser);
  }
}

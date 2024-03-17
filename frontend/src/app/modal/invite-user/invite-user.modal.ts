import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { ProjectData } from '../../states/project.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Component({
  templateUrl: './invite-user.modal.html',
  styleUrls: ['./invite-user.modal.scss'],
})
export class InviteUserModal {
  constructor(
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<InviteUserModal>,
    private readonly userService: UserService,
  ) {
    this.dialogRef.updateSize(undefined, '80%');
    this.loadProjects();
  }

  firstNameControl = new FormControl('', []);
  lastNameControl = new FormControl('', []);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  roleControl = new FormControl('', [Validators.required]);
  projectIdsControl = new FormControl([], []);

  projects: ProjectDto[] = undefined;

  isLoading = false;

  loadProjects() {
    this.store
      .pipe(select((value: any) => value.projectData))
      .subscribe((value: ProjectData) => (this.projects = value.projects));
  }

  create() {
    if (!this.emailControl.valid) {
      this.emailControl.markAsTouched();
      return;
    }
    if (!this.roleControl.valid) {
      this.roleControl.markAsTouched();
      return;
    }

    this.userService
      .invite({
        firstName: this.firstNameControl.value,
        lastName: this.lastNameControl.value,
        email: this.emailControl.value,
        role: this.getRole(),
        projectIds: this.projectIdsControl.value,
      })
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  private handleError(error: HttpErrorResponse) {
    this.emailControl.setErrors({ notUnique: true });
    // Return an observable with a user-facing error message.
    return new Observable();
  }

  getRole() {
    switch (this.roleControl.value) {
      case Role.ADMIN:
        return Role.ADMIN;
      case Role.DEVELOPER:
        return Role.DEVELOPER;
      case Role.PROJECT_MANAGER:
        return Role.PROJECT_MANAGER;
    }
    return Role.DEVELOPER;
  }

  protected readonly Role = Role;
}

import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { UserService } from '../../services/user.service';
import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { ProjectData } from '../../states/project.reducer';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { ProjectService } from '../../services/project.service';

@Component({
  templateUrl: './edit-user.modal.html',
  styleUrls: ['./edit-user.modal.scss'],
})
export class EditUserModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { user: UserDetailsDto },
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<EditUserModal>,
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {
    this.dialogRef.updateSize(undefined, '80%');
    this.loadProjects();
    this.setupValues();
  }

  firstNameControl = new FormControl('', []);
  lastNameControl = new FormControl('', []);
  emailControl = new FormControl('', [Validators.required, Validators.email]);
  roleControl = new FormControl('', [Validators.required]);
  projectIdsControl = new FormControl([], []);

  projects: ProjectDto[] = undefined;

  setupValues() {
    this.firstNameControl.setValue(this.data.user.firstName);
    this.lastNameControl.setValue(this.data.user.lastName);
    this.emailControl.setValue(this.data.user.email);
    this.roleControl.setValue(this.data.user.role);
  }

  loadProjects() {
    this.store
      .pipe(select((value: any) => value.projectData))
      .subscribe((value: ProjectData) => (this.projects = value.projects));
    this.projectService
      .listForUser(this.data.user.id)
      .subscribe((projects) =>
        this.projectIdsControl.setValue(projects.map((project) => project.id)),
      );
  }

  update() {
    if (!this.emailControl.valid) {
      this.emailControl.markAsTouched();
      return;
    }
    if (!this.roleControl.valid) {
      this.roleControl.markAsTouched();
      return;
    }

    this.userService
      .update(this.data.user.id, {
        firstName: this.firstNameControl.value,
        lastName: this.lastNameControl.value,
        email: this.emailControl.value,
        role: this.getRole(),
        projectIds: this.projectIdsControl.value,
      })
      .pipe(catchError(this.handleError.bind(this)))
      .subscribe(() => {
        this.dialogRef.close({ complete: true });
      });
  }

  private handleError(error: HttpErrorResponse) {
    this.emailControl.setErrors({ notUnique: true });
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

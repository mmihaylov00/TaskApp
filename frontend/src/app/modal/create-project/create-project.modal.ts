import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { addProject } from '../../states/project.reducer';
import { Store } from '@ngrx/store';
import { UserSearchComponent } from '../../components/user-search/user-search.component';
import { IconSelectComponent } from '../../components/icon-select/icon-select.component';
import { Router } from '@angular/router';

@Component({
  templateUrl: './create-project.modal.html',
  styleUrls: ['./create-project.modal.scss'],
})
export class CreateProjectModal {
  @ViewChild('search') search: UserSearchComponent;
  @ViewChild('icon') icon: IconSelectComponent;

  constructor(
    private readonly store: Store,
    private readonly router: Router,
    private readonly dialogRef: MatDialogRef<CreateProjectModal>,
    private readonly projectService: ProjectService,
  ) {
    this.dialogRef.updateSize('50%', '80%');
  }

  projectNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('#a56ea3', [Validators.required]);

  create() {
    if (!this.projectNameControl.valid) {
      this.projectNameControl.markAsTouched();
      return;
    }

    this.projectService
      .create({
        name: this.projectNameControl.value,
        color: this.colorControl.value,
        icon: this.icon.iconControl.value,
        userIds: this.search.selectedUsers.map((user) => user.id),
      })
      .subscribe(async (project) => {
        this.store.dispatch(
          addProject({ project: { ...project, compact: false } }),
        );
        await this.router.navigate(['project', project.id]);
        this.dialogRef.close();
      });
  }
}

import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { addProject, updateProject } from '../../states/project.reducer';
import { Store } from '@ngrx/store';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { UserService } from '../../services/user.service';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';

@Component({
  templateUrl: './edit-project.modal.html',
  styleUrls: ['./edit-project.modal.scss'],
})
export class EditProjectModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { project: ProjectDto },
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<EditProjectModal>,
    private readonly projectService: ProjectService,
  ) {
    this.setupValues();
  }

  projectNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('', [Validators.required]);

  setupValues() {
    this.projectNameControl.setValue(this.data.project.name);
    this.colorControl.setValue(this.data.project.color);
  }

  create() {
    if (!this.projectNameControl.valid) {
      this.projectNameControl.markAsTouched();
      return;
    }
    const data = {
      name: this.projectNameControl.value,
      color: this.colorControl.value,
      userIds: [],
    };

    this.projectService.update(this.data.project.id, data).subscribe(() => {
      this.store.dispatch(
        updateProject({
          project: { id: this.data.project.id, ...data, boards: [] },
        }),
      );
      this.dialogRef.close(data);
    });
  }
}

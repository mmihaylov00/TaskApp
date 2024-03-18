import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { updateProject } from '../../states/project.reducer';
import { Store } from '@ngrx/store';
import { ProjectDto } from 'taskapp-common/dist/src/dto/project.dto';
import { IconSelectComponent } from '../../components/icon-select/icon-select.component';
import { create } from 'sortablejs';

@Component({
  templateUrl: './edit-project.modal.html',
  styleUrls: ['./edit-project.modal.scss'],
})
export class EditProjectModal implements OnInit {
  @ViewChild('icon') icon: IconSelectComponent;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: { project: ProjectDto },
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<EditProjectModal>,
    private readonly projectService: ProjectService,
  ) {
    this.dialogRef.updateSize('50%', '50%');
  }

  projectNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.setupValues();
  }

  setupValues() {
    this.projectNameControl.setValue(this.data.project.name);
    this.colorControl.setValue(this.data.project.color);
    setTimeout(() => this.icon.iconControl.setValue(this.data.project.icon), 1);
  }

  create() {
    if (!this.projectNameControl.valid) {
      this.projectNameControl.markAsTouched();
      return;
    }
    const data = {
      name: this.projectNameControl.value,
      color: this.colorControl.value,
      icon: this.icon.iconControl.value,
      userIds: [],
    };

    this.projectService.update(this.data.project.id, data).subscribe(() => {
      this.store.dispatch(
        updateProject({
          project: {
            id: this.data.project.id,
            ...data,
            boards: [],
            icon: this.icon.iconControl.value,
          },
        }),
      );
      this.dialogRef.close(data);
    });
  }
}

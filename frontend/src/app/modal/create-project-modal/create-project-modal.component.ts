import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create-project-modal',
  templateUrl: './create-project-modal.component.html',
  styleUrls: ['./create-project-modal.component.scss'],
})
export class CreateProjectModal {
  constructor(
    private readonly dialogRef: MatDialogRef<CreateProjectModal>,
    private readonly projectService: ProjectService,
  ) {}

  projectNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('#a56ea3', [Validators.required]);

  readonly teams = [
    { id: 1, name: 'Team #1', members: 10 },
    { id: 2, name: 'Team #2', members: 5 },
    { id: 3, name: 'Team #3', members: 110 },
    { id: 4, name: 'Team #4', members: 11 },
    { id: 5, name: 'Team #5', members: 12 },
    { id: 6, name: 'Team #6', members: 13 },
  ];

  isLoading = false;

  create() {
    if (!this.projectNameControl.valid) {
      this.projectNameControl.markAsTouched();
      return;
    }

    this.projectService
      .create({
        name: this.projectNameControl.value,
        color: this.colorControl.value,
      })
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}

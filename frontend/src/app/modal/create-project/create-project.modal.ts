import { Component, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { addProject } from '../../states/project.reducer';
import { Store } from '@ngrx/store';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { UserService } from '../../services/user.service';
import { UserSearchComponent } from '../../components/user-search/user-search.component';

@Component({
  templateUrl: './create-project.modal.html',
  styleUrls: ['./create-project.modal.scss'],
})
export class CreateProjectModal {
  @ViewChild('search') search: UserSearchComponent;

  constructor(
    private readonly store: Store,
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
        userIds: this.search.selectedUsers.map((user) => user.id),
      })
      .subscribe((project) => {
        this.store.dispatch(
          addProject({ project: { ...project, compact: false } }),
        );
        this.dialogRef.close();
      });
  }
}

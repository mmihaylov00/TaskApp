import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { UserSearchComponent } from '../../components/user-search/user-search.component';
import { firstValueFrom } from 'rxjs';

@Component({
  templateUrl: './add-user.modal.html',
  styleUrls: ['./add-user.modal.scss'],
})
export class AddUserModal {
  @ViewChild('search') search: UserSearchComponent;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { project: { id: string; name: string } },
    private readonly dialogRef: MatDialogRef<AddUserModal>,
    private readonly projectService: ProjectService,
  ) {
    this.dialogRef.updateSize('50%', '50%');
  }

  create() {
    const promises = [];
    for (const user of this.search.selectedUsers) {
      const promise = firstValueFrom(
        this.projectService.addUser(this.data.project.id, user.id),
      );
      promises.push(promise);
    }
    Promise.all(promises)
      .catch(() => {
        this.dialogRef.close(true);
      })
      .then(() => {
        this.dialogRef.close(true);
      });
  }
}

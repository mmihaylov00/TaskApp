import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';

@Component({
  templateUrl: './confirm.modal.html',
  styleUrls: ['./confirm.modal.scss'],
})
export class ConfirmModal {
  constructor(
    private readonly dialogRef: MatDialogRef<ConfirmModal>,
    @Inject(MAT_DIALOG_DATA) readonly data: { title: string; action: string },
  ) {
    this.dialogRef.updateSize(undefined, '20%');
  }

  confirm() {
    this.dialogRef.close(true);
  }
}

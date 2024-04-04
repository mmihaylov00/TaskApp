import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserInvitedDto } from 'taskapp-common/dist/src/dto/user.dto';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  templateUrl: './user-invitation-link.modal.html',
  styleUrls: ['./user-invitation-link.modal.scss'],
})
export class UserInvitationLinkModal {
  linkCopied = false;

  constructor(
    private readonly dialogRef: MatDialogRef<UserInvitationLinkModal>,
    @Inject(MAT_DIALOG_DATA) readonly data: UserInvitedDto,
  ) {
    this.dialogRef.updateSize(undefined, '230px');
  }

  close() {
    this.dialogRef.close(true);
  }

  async copyLink(event: MouseEvent, copyTooltip: MatTooltip) {
    event.stopPropagation();
    this.linkCopied = true;
    await navigator.clipboard.writeText(this.data.link);
    setTimeout(() => copyTooltip.show(), 1);
  }
}

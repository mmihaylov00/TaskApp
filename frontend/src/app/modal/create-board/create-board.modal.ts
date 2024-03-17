import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { InviteUserModal } from '../invite-user/invite-user.modal';
import { BoardService } from '../../services/board.service';
import { addBoard, addProject } from '../../states/project.reducer';

@Component({
  templateUrl: './create-board.modal.html',
  styleUrls: ['./create-board.modal.scss'],
})
export class CreateBoardModal {
  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: { projectId: string },
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<InviteUserModal>,
    private readonly boardService: BoardService,
  ) {}

  boardNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('#a56ea3', [Validators.required]);

  readonly teams = [
    { id: 1, name: 'Team #1', members: 10 },
    { id: 2, name: 'Team #2', members: 5 },
    { id: 3, name: 'Team #3', members: 110 },
    { id: 4, name: 'Team #4', members: 11 },
    { id: 5, name: 'Team #5', members: 12 },
    { id: 6, name: 'Team #6', members: 13 },
  ];

  create() {
    if (!this.boardNameControl.valid) {
      this.boardNameControl.markAsTouched();
      return;
    }

    this.boardService
      .create({
        name: this.boardNameControl.value,
        color: this.colorControl.value,
        projectId: this.data.projectId,
      })
      .subscribe((board) => {
        this.store.dispatch(addBoard({ board }));
        this.dialogRef.close(board);
      });
  }
}

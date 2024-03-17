import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { InviteUserModal } from '../invite-user/invite-user.modal';
import { BoardService } from '../../services/board.service';
import {
  addBoard,
  addProject,
  updateBoard,
} from '../../states/project.reducer';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';

@Component({
  templateUrl: './manage-board.modal.html',
  styleUrls: ['./manage-board.modal.scss'],
})
export class ManageBoardModal {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { projectId: string; board?: BoardDto },
    private readonly store: Store,
    private readonly dialogRef: MatDialogRef<InviteUserModal>,
    private readonly boardService: BoardService,
  ) {
    this.setupControls();
  }

  boardNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('#a56ea3', [Validators.required]);

  setupControls() {
    if (this.data.board) {
      this.boardNameControl.setValue(this.data.board.name);
      this.colorControl.setValue(this.data.board.color);
    }
  }

  save() {
    if (!this.boardNameControl.valid) {
      this.boardNameControl.markAsTouched();
      return;
    }

    if (this.data.board) {
      this.update();
    } else {
      this.create();
    }
  }

  update() {
    const board = {
      id: this.data.board.id,
      name: this.boardNameControl.value,
      color: this.colorControl.value,
      projectId: this.data.projectId,
    };
    this.boardService.update(this.data.board.id, board).subscribe(() => {
      this.store.dispatch(updateBoard({ board: { ...board } }));
      this.dialogRef.close(board);
    });
  }

  create() {
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

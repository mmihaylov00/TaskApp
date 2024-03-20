import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { InviteUserModal } from '../invite-user/invite-user.modal';
import { BoardService } from '../../services/board.service';
import { addBoard, updateBoard } from '../../states/project.reducer';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import Sortable from 'sortablejs';
import { ManageStageDto } from 'taskapp-common/dist/src/dto/stage.dto';

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
    this.dialogRef.updateSize(undefined, '80%');
    this.setupControls();
  }

  readonly colors = [
    '#ead1dc',
    '#d9d2e9',
    '#cfe2f3',
    '#c9daf8',
    '#d0e0e3',
    '#d9ead3',
    '#fce5cd',
    '#fff2cc',
    '#f4cccc',
    '#e6b8af',
  ];

  ngOnInit() {
    setTimeout(() => {
      let element = document.getElementById('stages');
      Sortable.create(element, {
        group: 'stages',
        animation: 300,
        swapThreshold: 0.1,
        easing: 'cubic-bezier(1, 0, 0, 1)',
        onEnd: (event) => this.dropStage(event),
        ghostClass: 'ghost',
        dragClass: 'dragged',
      });
    }, 1);
  }

  boardNameControl = new FormControl('', [Validators.required]);
  colorControl = new FormControl('#a56ea3', [Validators.required]);
  stageControl = new FormControl('', []);

  stages: any[] = [
    { name: 'Backlog', color: this.colors[0] },
    { name: 'Sprint Planning', color: this.colors[1] },
    { name: 'In Progress', color: this.colors[2] },
    { name: 'Check / Testing', color: this.colors[3] },
    { name: 'Completed', color: this.colors[5] },
    { name: 'Blocked', color: this.colors[9] },
  ];

  dropStage(e) {
    console.log(e);
    const element = this.stages.splice(e.oldIndex, 1);
    this.stages.splice(e.newIndex, 0, ...element);
  }

  changeColor(stage: string, color: string) {
    if (!color?.length) return;
    for (const s of this.stages) {
      if (s.name === stage) {
        if (s.color === color) return;
        s.color = color;
      }
    }
  }

  addStage() {
    const value = this.stageControl.value;
    if (!value?.length) return;

    this.stages.push({
      name: value,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
    });
    this.stageControl.setValue('');
  }

  removeStage(stage) {
    this.stages.splice(this.stages.indexOf(stage), 1);
  }

  setupControls() {
    if (this.data.board) {
      this.boardNameControl.setValue(this.data.board.name);
      this.colorControl.setValue(this.data.board.color);
      this.stages = this.data.board.stages;
    }
  }

  save() {
    console.log(this.stages);
    if (!this.boardNameControl.valid) {
      this.boardNameControl.markAsTouched();
      return;
    }

    this.data.board ? this.update() : this.create();
  }

  update() {
    const board = {
      id: this.data.board.id,
      name: this.boardNameControl.value,
      color: this.colorControl.value,
      projectId: this.data.projectId,
      stages: this.stages,
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
        stages: this.stages,
      })
      .subscribe((board) => {
        this.store.dispatch(addBoard({ board }));
        this.dialogRef.close(board);
      });
  }
}

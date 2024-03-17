import { Component, OnInit } from '@angular/core';
import { ColumnDto } from '../../components/table/dtos/column.dto';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { MatDialog } from '@angular/material/dialog';
import { ManageBoardModal } from '../../modal/create-board/manage-board.modal';
import { ProjectService } from '../../services/project.service';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { EditProjectModal } from '../../modal/edit-project/edit-project.modal';
import { ConfirmModal } from '../../modal/confirm/confirm.modal';
import { AddUserModal } from '../../modal/add-user/add-user.modal';
import { addBoard, removeBoard } from '../../states/project.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  projectId: string;

  constructor(
    private readonly projectService: ProjectService,
    private readonly boardService: BoardService,
    private readonly route: ActivatedRoute,
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {}

  projectData: { name: string; values: { key: string; value: any }[] } = {
    name: '',
    values: [
      { key: 'Color', value: -1 },
      { key: 'Users', value: -1 },
      { key: 'Boards', value: -1 },
    ],
  };

  boardColumns: ColumnDto[] = [
    { key: 'name', header: 'Title', type: 'text' },
    { key: 'color', header: 'Color', type: 'color' },
    { key: 'actions', header: '', type: 'slot', width: 50 },
  ];
  boardData: BoardDto[] = undefined;

  userColumns: ColumnDto[] = [
    { key: 'firstName', header: 'First Name', type: 'text' },
    { key: 'lastName', header: 'Last Name', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' },
    { key: 'role', header: 'Role', type: 'text' },
    { key: 'actions', header: '', type: 'slot', width: 25 },
  ];
  userData: Page<UserDetailsDto> = undefined;
  userPage: PageRequestDto = { page: 1, pageAmount: 20 };
  userLoading = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('projectId');
      this.loadBoards();
      this.loadProject();
      this.loadUsers();
    });
  }

  loadBoards() {
    this.boardData = undefined;
    this.boardService.listByProject(this.projectId).subscribe((boards) => {
      this.boardData = boards;
      this.projectData.values[2].value = this.boardData.length;
    });
  }

  loadProject() {
    this.projectService.get(this.projectId).subscribe((project) => {
      this.projectData.name = project.name;
      this.projectData.values[0].value = project.color;
    });
  }

  changeUserPage(page: number) {
    this.userPage.page = page;
    this.userLoading = true;
    this.loadUsers();
  }

  loadUsers() {
    this.userData = undefined;
    this.projectService
      .listUsers(this.projectId, this.userPage)
      .subscribe((users) => {
        this.userData = users;
        this.userLoading = false;
        this.projectData.values[1].value = users.totalCount;
      });
  }

  editProject() {
    this.dialog
      .open(EditProjectModal, {
        data: {
          project: {
            id: this.projectId,
            name: this.projectData.name,
            color: this.projectData.values[0].value,
          },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        this.projectData.name = result.name;
        this.projectData.values[0].value = result.color;
      });
  }

  editBoard(board: BoardDto) {
    this.dialog
      .open(ManageBoardModal, {
        data: { projectId: this.projectId, board },
      })
      .afterClosed()
      .subscribe((board) => {
        if (!board) return;
        this.removeBoard(board);
        this.addBoard(board);
      });
  }

  archiveBoard(board: BoardDto) {
    this.dialog
      .open(ConfirmModal, {
        data: {
          title: 'Archive Board - ' + board.name,
          action: 'archive this board?',
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (!value) return;

        this.boardService.delete(board.id).subscribe(() => {
          this.removeBoard(board);
          this.boardData = [...this.boardData];
          this.store.dispatch(removeBoard({ board }));
        });
      });
  }

  removeBoard(board: BoardDto) {
    const boardIndex = this.boardData.findIndex((b) => b.id === board.id);
    this.boardData.splice(boardIndex, 1);
  }

  addBoard(board: BoardDto) {
    this.boardData.push(board);
    this.boardData = [
      ...this.boardData.sort((a, b) => a.name.localeCompare(b.name)),
    ];
    this.projectData.values[2].value = this.boardData.length;
  }

  removeUser(user: UserDetailsDto) {
    this.dialog
      .open(ConfirmModal, {
        data: {
          title: `Remove ${user.firstName} ${user.lastName} (${user.email})`,
          action: 'remove this user from project ' + this.projectData.name,
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (!value) return;

        this.projectService
          .removeUser(this.projectId, user.id)
          .subscribe(() => {
            this.loadUsers();
          });
      });
  }

  inviteUser() {
    this.dialog
      .open(AddUserModal, {
        data: {
          project: { id: this.projectId, name: this.projectData.name },
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (!value) return;

        this.loadUsers();
      });
  }

  createBoard() {
    this.dialog
      .open(ManageBoardModal, {
        data: { projectId: this.projectId },
      })
      .afterClosed()
      .subscribe((board) => {
        if (!board) return;
        this.addBoard(board);
      });
  }
}

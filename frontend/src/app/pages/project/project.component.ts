import { Component, OnInit } from '@angular/core';
import { ColumnDto } from '../../components/table/dtos/column.dto';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { MatDialog } from '@angular/material/dialog';
import { CreateBoardModal } from '../../modal/create-board/create-board.modal';
import { ProjectService } from '../../services/project.service';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { EditProjectModal } from '../../modal/edit-project/edit-project.modal';
import { ConfirmModal } from '../../modal/confirm/confirm.modal';
import { AddUserModal } from '../../modal/add-user/add-user.modal';

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
    let dialog = this.dialog.open(EditProjectModal, {
      data: {
        project: {
          id: this.projectId,
          name: this.projectData.name,
          color: this.projectData.values[0].value,
        },
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.projectData.name = result.name;
      this.projectData.values[0].value = result.color;
    });
  }

  editBoard(data) {
    console.log('edit');
  }

  removeUser(user: UserDetailsDto) {
    const title = `Remove ${user.firstName} ${user.lastName} (${user.email})`;

    const dialog = this.dialog.open(ConfirmModal, {
      data: {
        title,
        action: 'remove this user from project ' + this.projectData.name,
      },
    });
    dialog.afterClosed().subscribe((value) => {
      if (!value) return;

      this.projectService.removeUser(this.projectId, user.id).subscribe(() => {
        this.loadUsers();
      });
    });
  }

  inviteUser() {
    const dialog = this.dialog.open(AddUserModal, {
      data: {
        project: { id: this.projectId, name: this.projectData.name },
      },
    });
    dialog.afterClosed().subscribe((value) => {
      if (!value) return;

      this.loadUsers();
    });
  }

  createBoard() {
    let dialog = this.dialog.open(CreateBoardModal, {
      data: { projectId: this.projectId },
    });
    dialog.afterClosed().subscribe((result) => {
      if (!result) return;
      this.boardData.push(result);
      this.boardData = [
        ...this.boardData.sort((a, b) => a.name.localeCompare(b.name)),
      ];
      this.projectData.values[2].value = this.boardData.length;
    });
  }
}

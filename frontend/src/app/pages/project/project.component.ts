import { Component, OnInit } from '@angular/core';
import { ColumnDto } from '../../components/table/dtos/column.dto';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BoardService } from '../../services/board.service';
import { BoardDto } from 'taskapp-common/dist/src/dto/board.dto';
import { MatDialog } from '@angular/material/dialog';
import { ManageBoardModal } from '../../modal/manage-board/manage-board.modal';
import { ProjectService } from '../../services/project.service';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { EditProjectModal } from '../../modal/edit-project/edit-project.modal';
import { ConfirmModal } from '../../modal/confirm/confirm.modal';
import { AddUserModal } from '../../modal/add-user/add-user.modal';
import { notifyFavUpdate, removeBoard } from '../../states/project.reducer';
import { Store } from '@ngrx/store';
import { ROLE_COLORS } from 'taskapp-common/dist/src/enums/role.enum';
import { USER_STATUS_COLORS } from 'taskapp-common/dist/src/enums/user-status.enum';
import { ProjectStatsDto } from 'taskapp-common/dist/src/dto/project.dto';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexNonAxisChartSeries,
  ApexDataLabels,
  ApexPlotOptions,
  ApexXAxis,
  ApexLegend,
  ApexFill,
  ApexYAxis,
  ApexTooltip,
  ApexStates,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  states: ApexStates;
  plotOptions: ApexPlotOptions;
  labels: string[];
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  fill: ApexFill;
};

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
    private readonly router: Router,
    private readonly store: Store,
    private readonly dialog: MatDialog,
  ) {
    this.favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
  }

  values: any = {
    icon: undefined,
    color: undefined,
    users: undefined,
    boards: undefined,
  };
  favourites = [];

  projectData: { name: string; values: { title: string; key: any }[] } = {
    name: '',
    values: [
      { title: 'Icon', key: 'icon' },
      { title: 'Color', key: 'color' },
      { title: 'Users', key: 'users' },
      { title: 'Boards', key: 'boards' },
    ],
  };

  boardColumns: ColumnDto[] = [
    { key: 'favourite', header: '', type: 'slot', width: 5 },
    { key: 'name', header: 'Title', type: 'text' },
    { key: 'color', header: 'Color', type: 'color' },
    { key: 'stages', header: 'Stages', type: 'length' },
    { key: 'row-action', header: '', type: 'slot', width: 50 },
  ];
  boardData: BoardDto[] = undefined;

  userColumns: ColumnDto[] = [
    { key: 'firstName', header: 'First Name', type: 'text' },
    { key: 'lastName', header: 'Last Name', type: 'text' },
    { key: 'email', header: 'Email', type: 'text' },
    {
      key: 'role',
      header: 'Role',
      type: 'chip',
      colors: ROLE_COLORS,
    },
    {
      key: 'status',
      header: 'Status',
      type: 'chip',
      colors: USER_STATUS_COLORS,
    },
    { key: 'actions', header: '', type: 'slot', width: 25 },
  ];
  userData: Page<UserDetailsDto> = undefined;
  userPage: PageRequestDto = { page: 1, pageAmount: 20 };
  stats: ProjectStatsDto;
  userLoading = false;

  boardChartOptions: Partial<ChartOptions> = undefined;
  stagesChartOption: Partial<ChartOptions> = undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('projectId');
      this.loadProject();
      this.loadBoards();
      this.loadUsers();
    });
  }

  loadBoards() {
    this.boardData = undefined;
    this.boardService.listByProject(this.projectId).subscribe((boards) => {
      this.boardData = boards;
      this.values.boards = this.boardData.length;
      this.loadStats();
    });
  }

  loadProject() {
    this.projectService.get(this.projectId).subscribe({
      next: (project) => {
        this.projectData.name = project.name;
        this.values.icon = project.icon;
        this.values.color = project.color;
      },
      error: async () => {
        await this.router.navigate(['']);
      },
    });
  }

  loadStats() {
    this.projectService.getStats(this.projectId).subscribe((stats) => {
      this.stats = stats;
      this.configureBoardStats();
      this.configureStageStats();
    });
  }

  configureStageStats() {
    const series: number[] = [];
    const labels: string[] = [];
    const colors: string[] = [];
    for (const stage of this.stats.stages) {
      for (const board of this.boardData) {
        const stageDto = board.stages.find((s) => s.name === stage.name);
        if (stageDto) {
          series.push(+stage.tasks);
          labels.push(stage.name);
          colors.push(stageDto.color);
          break;
        }
      }
    }
    this.stagesChartOption = {
      series,
      labels,
      colors,
      chart: {
        type: 'donut',
        height: 240,
      },
      legend: {
        position: 'bottom',
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9,
          },
        },
      },
      tooltip: {
        fillSeriesColor: false,
        theme: 'light',
        onDatasetHover: {
          highlightDataSeries: true,
        },
      },
      dataLabels: {
        formatter: function (val, opts) {
          return opts.w.config.series[opts.seriesIndex];
        },
      },
      plotOptions: {
        pie: {},
      },
    };
  }

  configureBoardStats() {
    const series = [
      { name: 'PENDING', data: [], color: '#833ab4' },
      { name: 'COMPLETED', data: [], color: '#a56ea3' },
    ];
    const categories: string[] = [];
    for (const board of this.stats.boards) {
      const boardDto = this.boardData.find((b) => b.id === board.id);
      if (!boardDto) {
        continue;
      }
      categories.push(boardDto.name);
      series[0].data.push(board.pendingTasks);
      series[1].data.push(board.completedTasks);
    }

    this.boardChartOptions = {
      series,
      chart: {
        type: 'bar',
        height: 200,
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      xaxis: {
        type: 'category',
        categories,
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: 'bottom',
      },
      fill: {
        opacity: 1,
      },
    };
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
        this.values.users = users.totalCount;
      });
  }

  editProject() {
    this.dialog
      .open(EditProjectModal, {
        data: {
          project: {
            id: this.projectId,
            name: this.projectData.name,
            icon: this.values.icon,
            color: this.values.color,
          },
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (!result) return;
        this.projectData.name = result.name;
        this.values.icon = result.icon;
        this.values.color = result.color;
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
          this.loadStats();
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
    this.values.boards = this.boardData.length;
  }

  removeUser(user: UserDetailsDto) {
    this.dialog
      .open(ConfirmModal, {
        data: {
          title: `Remove ${user.firstName} ${user.lastName} (${user.email})`,
          action: `remove this user from project ${this.projectData.name}?`,
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
      .subscribe(async (board) => {
        if (!board) return;
        this.addBoard(board);
        await this.router.navigate([
          'project',
          this.projectId,
          'board',
          board.id,
        ]);
      });
  }

  changeFav(board: BoardDto) {
    const index = this.favourites.indexOf(board.id);
    if (index === -1) {
      this.favourites.push(board.id);
    } else {
      this.favourites.splice(index, 1);
    }
    localStorage.setItem('favourites', JSON.stringify(this.favourites));

    this.store.dispatch(notifyFavUpdate({}));
  }

  isUndefined(val: any) {
    return val === undefined;
  }
}

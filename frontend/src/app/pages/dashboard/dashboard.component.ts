import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserStatsDto } from 'taskapp-common/dist/src/dto/user.dto';
import { ChartOptions } from '../../components/chart/chart.component';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { NotificationService } from '../../services/notification.service';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import { PageEvent } from '@angular/material/paginator';
import { relativeDateFormat } from '../../utils/date-formatter.util';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  stats: UserStatsDto;

  notifications: Page<NotificationDto>;
  notificationsPage: PageRequestDto = { page: 1, pageAmount: 5 };

  tasksChartOptions: Partial<ChartOptions> = undefined;
  createdTasksChartOptions: Partial<ChartOptions> = undefined;
  overallTaskContributionChartOptions: Partial<ChartOptions> = undefined;
  taskPerStagesChartOptions: Partial<ChartOptions> = undefined;
  taskPerBoardChartOptions: Partial<ChartOptions> = undefined;

  ngOnInit() {
    this.userService.getStats().subscribe((stats) => {
      this.stats = stats;
      this.setupCreatedTasksChart();
      this.setupTasksChart();
      this.setupOverallTaskChart();
      this.setupTaskPerStageChart();
      this.setupTaskPerBoarChart();
    });
    this.loadNotifications();
  }

  setupCreatedTasksChart() {
    const series = [this.stats.createdTasks, this.stats.overallCreatedTasks];
    const labels = ['Created by you', 'Created by others'];
    const colors = ['#a56ea3', '#833ab4'];

    this.createdTasksChartOptions = { series, labels, colors };
  }

  setupTasksChart() {
    const series = [
      this.stats.pendingTasks,
      this.stats.overallPendingTasks,
      this.stats.overallUnassignedTasks,
    ];
    const labels = ['Assigned to you', 'Assigned to others', 'Unassigned'];
    const colors = ['#a56ea3', '#833ab4', '#bb2124'];

    this.tasksChartOptions = { series, labels, colors };
  }

  setupOverallTaskChart() {
    const series = [
      {
        name: 'Pending',
        data: [
          this.stats.pendingTasks,
          this.stats.overallPendingTasks,
          this.stats.overallUnassignedTasks,
        ],
        color: '#833ab4',
      },
      {
        name: 'Completed',
        data: [this.stats.completedTasks, this.stats.overallCompletedTasks, 0],
        color: '#a56ea3',
      },
    ];
    const categories = ['Assigned to you', 'Assigned to others', 'Unassigned'];

    this.overallTaskContributionChartOptions = {
      series,
      xaxis: {
        type: 'category',
        categories,
      },
    };
  }

  setupTaskPerStageChart() {
    const series: number[] = [];
    const labels: string[] = [];
    const colors: string[] = [];
    for (const stage of this.stats.taskStages) {
      series.push(stage.tasks);
      labels.push(stage.name);
      colors.push(stage.color);
    }
    this.taskPerStagesChartOptions = { series, labels, colors };
  }

  setupTaskPerBoarChart() {
    const series = [
      {
        name: 'Pending',
        data: [],
        color: '#833ab4',
      },
      {
        name: 'Completed',
        data: [],
        color: '#a56ea3',
      },
    ];
    const categories = [];
    for (const taskBoard of this.stats.taskBoards) {
      categories.push(taskBoard.name);
      series[0].data.push(taskBoard.pendingTasks);
      series[1].data.push(taskBoard.completedTasks);
    }

    this.taskPerBoardChartOptions = {
      series,
      xaxis: {
        labels: {
          show: !!categories.length,
        },
        type: 'category',
        categories,
      },
    };
  }

  loadNotifications() {
    this.notificationService
      .list(this.notificationsPage)
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
  }

  changeNotificationsPage(page: PageEvent) {
    this.notificationsPage.page = page.pageIndex + 1;
    this.notifications = undefined;
    this.loadNotifications();
  }

  notificationClick(link: string) {
    window.location.replace(link);
  }

  deleteNotification(event: MouseEvent, id: string) {
    event.stopPropagation();
    this.notificationService.delete(id).subscribe(() => {
      this.loadNotifications();
    });
  }

  protected readonly UserStatus = UserStatus;
  protected readonly relativeDateFormat = relativeDateFormat;
}

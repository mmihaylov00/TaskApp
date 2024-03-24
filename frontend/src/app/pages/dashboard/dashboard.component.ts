import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserStatsDto } from 'taskapp-common/dist/src/dto/user.dto';
import { ChartOptions } from '../../components/chart/chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private readonly userService: UserService) {}

  stats: UserStatsDto;

  tasksChartOptions: Partial<ChartOptions> = undefined;
  createdTasksChartOptions: Partial<ChartOptions> = undefined;
  overallTaskContributionChartOptions: Partial<ChartOptions> = undefined;
  taskPerStagesChartOptions: Partial<ChartOptions> = undefined;

  ngOnInit(): void {
    this.userService.getStats().subscribe((stats) => {
      this.stats = stats;
      this.setupCreatedTasksChart();
      this.setupTasksChart();
      this.setupOverallTaskChart();
      this.setupTaskPerStageeChart();
    });
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
      this.stats.overallCompletedTasks,
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
    const categories = ['By you', 'By others', 'Unassigned'];

    this.overallTaskContributionChartOptions = {
      series,
      xaxis: {
        type: 'category',
        categories,
      },
    };
  }

  setupTaskPerStageeChart() {
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

  protected readonly undefined = undefined;
}

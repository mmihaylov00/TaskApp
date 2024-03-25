import { Component, Input } from '@angular/core';
import { relativeDateFormat } from '../../utils/date-formatter.util';
import { TASK_PRIORITY_COLORS } from 'taskapp-common/dist/src/enums/task-priority.enum';
import { Router } from '@angular/router';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';

@Component({
  selector: 'app-task-card[task]',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input('task') task: TaskDto;
  @Input('thumbnail') thumbnail?: string;
  @Input('color') color: string;
  constructor(private readonly router: Router) {}

  protected readonly TASK_PRIORITY_COLORS = TASK_PRIORITY_COLORS;

  async viewTask(task) {
    await this.router.navigate([], {
      replaceUrl: false,
      queryParams: { task: task.id },
    });
  }

  protected readonly relativeDateFormat = relativeDateFormat;
}

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { select, Store } from '@ngrx/store';
import { ProfileData } from '../../states/profile.reducer';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss'],
})
export class MyTasksComponent implements OnInit {
  constructor(
    private readonly taskService: TaskService,
    private readonly store: Store,
  ) {}

  tasks: TaskDto[];
  profile: ProfileData;

  ngOnInit() {
    this.store
      .pipe(select((value: any) => value.profileData))
      .subscribe((value: ProfileData) => {
        this.profile = value;
        this.setupAssignee();
      });
    this.taskService.getAssigned().subscribe((tasks) => {
      this.tasks = tasks;
      this.setupAssignee();
    });
  }

  setupAssignee() {
    if (!this.profile || !this.tasks?.length) {
      return;
    }

    for (const task of this.tasks) {
      task.assignee = {
        id: '',
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email,
        role: this.profile.role,
        status: this.profile.status,
      };
    }
  }
}

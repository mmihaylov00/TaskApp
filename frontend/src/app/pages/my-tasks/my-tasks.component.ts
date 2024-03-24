import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { AttachmentService } from '../../services/attachment.service';
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
    private readonly attachmentService: AttachmentService,
    private readonly store: Store,
  ) {}

  tasks: TaskDto[] = [];
  loadedAttachments: any = {};
  profile: ProfileData;

  ngOnInit(): void {
    this.store
      .pipe(select((value: any) => value.profileData))
      .subscribe((value: ProfileData) => {
        this.profile = value;
        this.setupAssignee();
      });
    this.taskService.getAssigned().subscribe((tasks) => {
      this.tasks = tasks;
      for (const task of this.tasks) {
        this.getAttachment(task.thumbnail);
      }
      this.setupAssignee();
    });
  }

  setupAssignee() {
    if (!this.profile || !this.tasks.length) {
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

  getAttachment(id: string) {
    if (!id) {
      return;
    }
    this.attachmentService.get(id).subscribe((file) => {
      this.loadedAttachments[id] = URL.createObjectURL(file);
    });
  }
}

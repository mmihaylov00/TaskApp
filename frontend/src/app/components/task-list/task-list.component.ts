import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { AttachmentService } from '../../services/attachment.service';

@Component({
  selector: 'app-task-list[tasks][title][emptyMessage]',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnChanges {
  @Input('tasks') tasks: TaskDto[] | undefined;
  @Input('title') title: string;
  @Input('emptyMessage') emptyMessage: string;

  loadedAttachments: { [id: string]: string } = {};

  constructor(private readonly attachmentService: AttachmentService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tasks']) {
      if (!this.tasks) return;

      for (const task of this.tasks) {
        this.getAttachment(task.thumbnail);
      }
    }
  }

  getAttachment(id: string) {
    if (!id || this.loadedAttachments[id]) {
      return;
    }
    this.attachmentService.get(id).subscribe((file) => {
      this.loadedAttachments[id] = URL.createObjectURL(file);
    });
  }
}

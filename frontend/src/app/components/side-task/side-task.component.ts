import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { TaskService } from '../../services/task.service';
import { setTaskOpenState } from '../../states/nav.reducer';
import { map, Observable, startWith } from 'rxjs';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { Editor, Toolbar } from 'ngx-editor';
import { FormControl, Validators } from '@angular/forms';
import { CreateTaskDto, TaskDto } from 'taskapp-common/dist/src/dto/task.dto';
import { TaskPriority } from 'taskapp-common/dist/src/enums/task-priority.enum';
import { StageDto } from 'taskapp-common/dist/src/dto/stage.dto';
import { BoardData } from '../../states/board.reducer';
import { formatDateTime } from '../../utils/date-formatter.util';
import { ConfirmModal } from '../../modal/confirm/confirm.modal';
import { AttachmentService } from '../../services/attachment.service';
import { AttachmentDataDto } from 'taskapp-common/dist/src/dto/attachment.dto';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-side-task',
  templateUrl: '/side-task.component.html',
  styleUrls: ['./side-task.component.scss'],
})
export class SideTaskComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly sanitizer: DomSanitizer,
    private readonly taskService: TaskService,
    private readonly attachmentService: AttachmentService,
  ) {}

  linkCopied = false;
  dropVisible = false;

  taskId = '';
  boardId = '';
  projectId = '';

  loadedAttachments: any = {};

  task: TaskDto;

  stages: StageDto[] = [];
  boardStages: StageDto[] = [];

  users: UserDetailsDto[] = [];
  filteredUsers: Observable<UserDetailsDto[]>;

  editor: Editor;
  today = new Date();

  titleControl = new FormControl('', [Validators.required]);
  descriptionControl = new FormControl('', []);
  priorityControl = new FormControl<TaskPriority>(undefined, []);
  assigneeIdControl = new FormControl('', []);
  assigneeControl = new FormControl<any>('', []);
  deadlineControl = new FormControl<Date>(undefined, []);
  stageControl = new FormControl('', [Validators.required]);

  saveEnabled = false;

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['text_color', 'background_color'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    ['link', 'image'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['format_clear'],
  ];

  readonly MENU_ITEMS = [
    {
      icon: 'check_circle',
      title: 'Complete',
      onClick: () => this.completeTask(),
    },
    {
      icon: 'delete',
      color: 'warn',
      title: 'Delete',
      onClick: () => this.deleteTask(),
    },
  ];

  ngOnInit(): void {
    this.today.setDate(this.today.getDate() - 1);
    this.createEditor();
    this.enableFileDrop();

    setTimeout(() => {
      this.route.queryParamMap.subscribe(async (params) => {
        this.taskId = params.get('task');
        this.stages = this.boardStages;

        if (this.taskId) {
          this.selectedFiles = [];
          if (this.taskId === '_') {
            this.task = undefined;
            this.open();
            return;
          }

          this.taskService.get(this.taskId).subscribe({
            next: (task) => this.open(task),
            error: () => this.confirmClose(),
          });
        } else {
          await this.confirmClose();
        }
      });
    }, 1);
    this.store
      .pipe(select((value: any) => value.boardData))
      .subscribe((data: BoardData) => {
        this.boardId = data.boardId;
        this.projectId = data.projectId;
        this.users = data.users;
        if (data.stages) {
          this.stages = data.stages;
          this.boardStages = data.stages;
          this.stageControl.setValue(this.task?.stage || this.stages[0]?.id);
          this.saveEnabled = false;
        }
      });
  }

  setupUpdate() {
    if (this.saveEnabled) {
      this.saveEnabled = false;
      return;
    }
    const enable = () => (this.saveEnabled = true);
    this.titleControl.valueChanges.subscribe(() => enable());
    this.descriptionControl.valueChanges.subscribe(() => enable());
    this.priorityControl.valueChanges.subscribe(() => enable());
    this.assigneeIdControl.valueChanges.subscribe(() => enable());
    this.deadlineControl.valueChanges.subscribe(() => enable());
    this.stageControl.valueChanges.subscribe(() => enable());
  }

  enableFileDrop() {
    window.addEventListener('dragenter', (e) => this.showDropZone(e));
  }

  allowDrag(event) {
    event.dataTransfer.dropEffect = 'copy';
    event.preventDefault();
  }

  handleDrop(event) {
    event.preventDefault();
    this.hideDropZone();
    this.uploadFiles(event.dataTransfer.files);
  }

  hideDropZone() {
    this.dropVisible = false;
  }

  showDropZone(event: DragEvent) {
    if (event.dataTransfer.effectAllowed === 'move') {
      return;
    }
    this.dropVisible = true;
  }

  deleteTask() {
    this.dialog
      .open(ConfirmModal, {
        data: {
          title: 'Delete Task - ' + this.task.title,
          action: 'delete this task? This action cannot be reversed!',
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (!value) return;

        this.taskService
          .delete(this.taskId)
          .subscribe(() => this.confirmClose());
      });
  }

  completeTask() {
    this.dialog
      .open(ConfirmModal, {
        data: {
          title: 'Complete Task - ' + this.task.title,
          action: 'complete this task?',
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (!value) return;

        this.taskService
          .complete(this.taskId)
          .subscribe(() => this.confirmClose());
      });
  }

  createEditor() {
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true,
    });
  }

  dateFilter = (d: Date | null): boolean => {
    return d >= this.today;
  };

  open(task?: TaskDto) {
    this.task = task;
    if (!this.stages.length && this.task) {
      this.taskService.getStages(this.taskId).subscribe((stages) => {
        this.stages = stages;
        this.stageControl.setValue(this.task?.stage || this.stages[0]?.id);
        this.saveEnabled = false;
      });
    }
    if (this.task?.attachments) {
      for (const attachment of this.task?.attachments) {
        this.getAttachment(attachment);
      }
    }
    this.store.dispatch(setTaskOpenState({ isOpen: true }));
    this.filteredUsers = this.assigneeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );
    this.setupValues();
    setTimeout(() => this.setupUpdate(), 1);
  }

  async close() {
    if (this.saveEnabled) {
      this.dialog
        .open(ConfirmModal, {
          data: {
            title: 'Close unsaved task',
            action: 'close without saving?',
          },
        })
        .afterClosed()
        .subscribe(async (value) => {
          if (!value) return;
          await this.confirmClose();
        });
    } else {
      await this.confirmClose();
    }
  }

  async confirmClose() {
    await this.router.navigate([], { replaceUrl: false, queryParams: {} });
    this.store.dispatch(setTaskOpenState({ isOpen: false }));
  }

  setupValues() {
    this.stageControl.setValue(this.task?.stage || this.stages[0]?.id);

    this.titleControl.setValue(this.task?.title || '');
    this.descriptionControl.setValue(this.task?.description || undefined);
    this.priorityControl.setValue(this.task?.priority || undefined);
    this.assigneeControl.setValue(this.fullUsername(this.task?.assignee));
    this.assigneeIdControl.setValue(this.task?.assignee?.id || '');
    this.deadlineControl.setValue(this.task?.deadline || undefined);
  }

  save() {
    if (!this.titleControl.valid) {
      this.titleControl.markAsTouched();
      return;
    }
    if (!this.stageControl.valid) {
      this.stageControl.markAsTouched();
      return;
    }

    const data: CreateTaskDto = {
      title: this.titleControl.value,
      description: this.descriptionControl.value,
      assignee: this.assigneeIdControl.value,
      boardId: this.boardId,
      stage: this.stageControl.value,
      deadline: this.deadlineControl.value,
      priority: this.priorityControl.value,
    };

    if (this.task?.id) {
      const updateTask = (data) => {
        this.taskService.update(this.task.id, data).subscribe(async (task) => {
          this.task = task;
          this.selectedFiles = [];
          for (const attachment of this.task.attachments) {
            this.getAttachment(attachment);
          }
        });
      };
      this.saveEnabled = false;
      if (this.selectedFiles.length) {
        let count = 0;
        for (const file of this.selectedFiles) {
          this.attachmentService
            .upload(file.file, file.extension, this.task.id)
            .subscribe(() => {
              if (this.selectedFiles.length === ++count) {
                updateTask(data);
              }
            });
        }
      } else {
        updateTask(data);
      }
    } else {
      const navigateToTask = async (taskId: string) => {
        await this.router.navigate([], {
          replaceUrl: false,
          queryParams: { task: taskId },
        });
      };

      this.taskService.create(data).subscribe(async (task) => {
        this.saveEnabled = false;
        if (this.selectedFiles.length) {
          let count = 0;
          for (const file of this.selectedFiles) {
            this.attachmentService
              .upload(file.file, file.extension, task.id)
              .subscribe(async () => {
                if (this.selectedFiles.length === ++count) {
                  await navigateToTask(task.id);
                }
              });
          }
        } else {
          await navigateToTask(task.id);
        }
      });
    }
  }

  async copyLink(copyTooltip) {
    this.linkCopied = true;
    await navigator.clipboard.writeText(window.location.href);
    setTimeout(() => copyTooltip.show(), 1);
    setTimeout(() => (this.linkCopied = false), 1000);
  }

  fullUsername(user: UserDetailsDto): string {
    if (!user) return '';
    return `${user.firstName} ${user.lastName} (${user.email})`;
  }

  private _filter(value): UserDetailsDto[] {
    if (value.id) {
      this.assigneeControl.setValue(this.fullUsername(value));
      this.assigneeIdControl.setValue(value.id);
      return this.users;
    }
    const filterValue = value.toLowerCase();

    return this.users.filter((user) =>
      this.fullUsername(user).toLowerCase().includes(filterValue),
    );
  }

  clearAssignee() {
    this.assigneeControl.reset();
    this.assigneeIdControl.setValue('');
  }

  selectedFiles: {
    file: File;
    preview: any;
    progress: number;
    extension: string;
  }[] = [];

  selectFile(event: any): void {
    this.uploadFiles(event.target.files);
  }

  uploadFiles(files: FileList) {
    if (!files) {
      return;
    }
    for (let i = files.length - 1; i >= 0; i--) {
      const file = files.item(i);
      if (!file) {
        continue;
      }
      const nameSplit = file.name.split('.');
      const extension = nameSplit[nameSplit.length - 1];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const preview = e.target.result;
        this.selectedFiles.splice(0, 0, {
          file,
          preview,
          progress: 0,
          extension,
        });
        this.saveEnabled = true;
      };

      reader.readAsDataURL(file);
    }
  }

  removeFile(index) {
    this.selectedFiles.splice(index, 1);
  }

  deleteFile(event, attachment: AttachmentDataDto) {
    event.stopPropagation();

    this.dialog
      .open(ConfirmModal, {
        data: {
          title: 'Delete Attachment - ' + attachment.name,
          action: 'delete this attachment?',
        },
      })
      .afterClosed()
      .subscribe((value) => {
        if (!value) return;

        this.confirmDeleteFile(attachment.id);
      });
  }

  confirmDeleteFile(attachmentId: string) {
    this.attachmentService.delete(attachmentId).subscribe(() => {
      const index = this.task.attachments.findIndex(
        (a) => a.id === attachmentId,
      );
      if (index > -1) {
        this.task.attachments.splice(index, 1);
      }
    });
  }

  download(attachment: AttachmentDataDto) {
    if (this.loadedAttachments[attachment.id]) {
      this.downloadFile(attachment, this.loadedAttachments[attachment.id]);
      return;
    }

    this.attachmentService.get(attachment.id).subscribe((file) => {
      this.downloadFile(attachment, URL.createObjectURL(file));
    });
  }

  downloadFile(attachment: AttachmentDataDto, url: string) {
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name;
    link.className = 'd-none';

    document.body.appendChild(link);

    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      }),
    );

    document.body.removeChild(link);
  }

  getAttachment(attachment: AttachmentDataDto) {
    if (
      this.loadedAttachments[attachment.id] ||
      !attachment.mime.match(/image\/.+/)
    ) {
      return;
    }
    this.attachmentService.get(attachment.id).subscribe((file) => {
      this.loadedAttachments[attachment.id] = URL.createObjectURL(file);
    });
  }

  protected readonly TaskPriority = TaskPriority;
  protected readonly formatDateTime = formatDateTime;
}

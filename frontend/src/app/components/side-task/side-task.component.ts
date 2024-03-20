import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
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
import { ProjectData } from '../../states/project.reducer';
import { BoardData } from '../../states/board.reducer';

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
    private readonly taskService: TaskService,
  ) {}

  taskId = '';
  boardId = '';
  projectId = '';

  task: TaskDto;

  stages: StageDto[] = [];

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

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['horizontal_rule', 'format_clear'],
  ];

  readonly MENU_ITEMS = [
    {
      icon: 'archive',
      title: 'Archive',
      onClick: () => {},
    },
    {
      icon: 'delete',
      color: 'warn',
      title: 'Delete',
      onClick: () => {},
    },
  ];

  ngOnInit(): void {
    this.createEditor();
    setTimeout(() => {
      this.route.queryParamMap.subscribe(async (params) => {
        this.taskId = params.get('task');

        if (this.taskId) {
          if (this.taskId === '_') {
            this.task = undefined;
            this.open();
            return;
          }

          this.taskService.get(this.taskId).subscribe((task) => {
            this.open(task);
          });
        } else {
          await this.close();
        }
      });
    }, 1);
    this.store
      .pipe(select((value: any) => value.boardData))
      .subscribe((data: BoardData) => {
        this.boardId = data.boardId;
        this.projectId = data.projectId;
        this.users = data.users;
        this.stages = data.stages;
      });
  }

  createEditor() {
    this.editor = new Editor({
      history: true,
      keyboardShortcuts: true,
    });
  }

  extractUrl() {
    this.router.url;
  }

  dateFilter = (d: Date | null): boolean => {
    return d >= this.today;
  };

  open(task?: TaskDto) {
    this.task = task;
    this.store.dispatch(setTaskOpenState({ isOpen: true }));
    this.filteredUsers = this.assigneeControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || '')),
    );
    this.setupValues();
  }

  async close() {
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
      this.taskService
        .update(this.task.id, data)
        .subscribe(async () => await this.close());
    } else {
      this.taskService.create(data).subscribe(async () => await this.close());
    }
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

  protected readonly TaskPriority = TaskPriority;
}

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import Sortable from 'sortablejs';
import { BoardService } from '../../services/board.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { TaskService } from '../../services/task.service';
import { StageDto } from 'taskapp-common/dist/src/dto/stage.dto';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import {
  TaskDto,
  TaskMovedDto,
  TaskRemovedDto,
} from 'taskapp-common/dist/src/dto/task.dto';
import { TASK_PRIORITY_COLORS } from 'taskapp-common/dist/src/enums/task-priority.enum';
import { formatDate } from '../../utils/date-formatter.util';
import { Store } from '@ngrx/store';
import { setBoardData } from '../../states/board.reducer';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
})
export class TaskBoardComponent implements OnInit, OnDestroy {
  constructor(
    private readonly projectService: ProjectService,
    private readonly boardService: BoardService,
    private readonly taskService: TaskService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  boardId: string;
  projectId: string;

  boardName = '';
  stages: StageDto[] = [];
  users: UserDetailsDto[] = [];

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    let target = event.target as HTMLElement;
    while (true) {
      if (!target.parentElement) return;
      if (target.classList.contains('board')) break;

      if (target.classList.contains('stage')) {
        if (target.scrollHeight != target.clientHeight) return;
        break;
      }

      target = target.parentElement;
    }
    event.preventDefault();

    if (!event.shiftKey) {
      const container =
        document.querySelector('#task-board').parentElement.parentElement;
      if (container) {
        container.scrollLeft += event.deltaY > 0 ? 100 : -100;
      }
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (this.boardId && this.boardId === params.get('boardId')) {
        return;
      }
      this.projectId = params.get('projectId');
      this.boardId = params.get('boardId');
      this.store.dispatch(
        setBoardData({ projectId: this.projectId, boardId: this.boardId }),
      );
      this.loadBoards();
      this.loadUsers();
      this.subscribe();
    });
  }

  readonly events = [
    'task-created',
    'task-updated',
    'task-moved',
    'task-removed',
  ];

  ngOnDestroy() {
    this.boardService.unsubscribe(...this.events);
  }

  subscribe() {
    this.boardService.unsubscribe(...this.events);

    this.boardService.listen(this.boardId, {
      'task-created': (data: TaskDto) => {
        for (const stage of this.stages) {
          if (stage.id === data.stage) {
            stage.tasks.splice(0, 0, data);
            return;
          }
        }
      },
      'task-updated': (data: TaskDto) => {
        for (const stage of this.stages) {
          for (let i = 0; i < stage.tasks.length; i++) {
            if (stage.tasks[i].id == data.id) {
              const task = stage.tasks.splice(i, 1)[0];
              if (data.stage === task.stage) {
                stage.tasks.splice(i, 0, data);
                return;
              }
              break;
            }
          }
          if (stage.id == data.stage) {
            stage.tasks.splice(0, 0, data);
          }
        }
      },
      'task-moved': (data: TaskMovedDto) => {
        let task: TaskDto;
        for (const stage of this.stages) {
          if (data.oldStageId == stage.id) {
            const index = stage.tasks.findIndex(
              (task) => task.id === data.taskId,
            );
            if (index > -1) {
              const splicedTasks = stage.tasks.splice(index, 1);
              task = splicedTasks[0];
              break;
            }
          }
        }
        if (task) {
          for (const stage of this.stages) {
            if (data.newStageId == stage.id) {
              task.stage = stage.id;
              stage.tasks.splice(data.index, 0, task);
              break;
            }
          }
        }
      },
      'task-removed': (data: TaskRemovedDto) => {
        for (const stage of this.stages) {
          if (data.stageId == stage.id) {
            const index = stage.tasks.findIndex(
              (task) => task.id === data.taskId,
            );
            if (index > -1) {
              stage.tasks.splice(index, 1);
              return;
            }
          }
        }
      },
    });
  }

  loadBoards() {
    this.boardService.get(this.boardId).subscribe({
      next: async (board) => {
        this.stages = board.stages;
        this.boardName = board.name;

        this.store.dispatch(
          setBoardData({ stages: JSON.parse(JSON.stringify(this.stages)) }),
        );

        setTimeout(() => {
          for (let stage of this.stages) {
            let element = document.getElementById(`${stage.id}`);
            Sortable.create(element, {
              group: 'tasks',
              animation: 250,
              draggable: '.task',
              direction: 'vertical',
              swapThreshold: 0.1,
              easing: 'cubic-bezier(1, 0, 0, 1)',
              onEnd: (event) => {
                const index = event.newDraggableIndex;
                const stageId = event.to.id;
                if (
                  event.from.id === stageId &&
                  event.oldDraggableIndex === index
                ) {
                  return;
                }
                const taskId = event.item.id;
                this.taskService
                  .move(taskId, { stageId, index, boardId: this.boardId })
                  .subscribe(() => {});
              },
              ghostClass: 'ghost',
              dragClass: 'dragged',
            });
          }
        }, 1);
      },
      error: async () => {
        await this.router.navigate(['']);
      },
    });
  }

  async viewTask(task) {
    await this.router.navigate([], {
      replaceUrl: false,
      queryParams: { task: task.id },
    });
  }

  loadUsers() {
    this.projectService
      .listUsers(this.projectId, { page: 1, pageAmount: 100 })
      .subscribe((users) => {
        this.users = users.items;
        this.store.dispatch(
          setBoardData({ users: JSON.parse(JSON.stringify(this.users)) }),
        );
      });
  }

  async newTask() {
    await this.router.navigate([], {
      replaceUrl: false,
      queryParams: { task: '_' },
    });
    // this.dialog.open(ManageTaskModal, {
    //   data: { stages: this.stages, users: this.users, boardId: this.boardId },
    // });
  }

  protected readonly TASK_PRIORITY_COLORS = TASK_PRIORITY_COLORS;
  protected readonly formatDate = formatDate;
}

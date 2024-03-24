import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ProfileSetupDto,
  UserDetailsDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateUserDto } from 'taskapp-common/dist/src/dto/user.dto';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';
import {
  CreateTaskDto,
  MoveTaskDto,
  TaskDto,
} from 'taskapp-common/dist/src/dto/task.dto';
import { StageDto } from 'taskapp-common/dist/src/dto/stage.dto';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  create(data: CreateTaskDto) {
    return this.http.post<TaskDto>('tasks', data);
  }

  update(id: string, data: CreateTaskDto) {
    return this.http.put<TaskDto>('tasks/' + id, data);
  }

  move(id: string, data: MoveTaskDto) {
    return this.http.put<TaskDto>('tasks/' + id + '/stage', data);
  }

  get(id: string) {
    return this.http.get<TaskDto>('tasks/' + id);
  }

  getStages(id: string) {
    return this.http.get<StageDto[]>('tasks/' + id + '/stages');
  }

  getAssigned() {
    return this.http.get<TaskDto[]>('tasks/assigned');
  }

  complete(id: string) {
    return this.http.put<void>('tasks/' + id + '/complete', {});
  }

  delete(id: string) {
    return this.http.delete<void>('tasks/' + id);
  }

  find(search: string) {
    return this.http.post<TaskDto[]>('tasks/search', { search });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import {
  CreateProjectDto,
  ProjectDto,
} from 'taskapp-common/dist/src/dto/project.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  get(id: string) {
    return this.http.get<ProjectDto>('projects/' + id);
  }

  list(pageSize: number = 20) {
    return this.http.get<Page<ProjectDto>>('projects?pageSize=' + pageSize);
  }

  create(data: CreateProjectDto) {
    return this.http.post<ProjectDto>('projects', data);
  }

  update(id: string, data: CreateProjectDto) {
    return this.http.put<void>('projects/' + id, data);
  }

  listForUser(id: string) {
    return this.http.get<ProjectDto[]>('projects/user/' + id);
  }

  delete(id: string) {
    return this.http.delete<void>('projects/' + id);
  }

  listUsers(id: string, page: PageRequestDto) {
    return this.http.get<Page<UserDetailsDto>>(
      'projects/' + id + '/user?' + Page.urlParams(page),
    );
  }

  addUser(id: string, userId: string) {
    return this.http.put<void>('projects/' + id + '/user/' + userId, {});
  }

  removeUser(id: string, userId: string) {
    return this.http.delete<void>('projects/' + id + '/user/' + userId);
  }
}

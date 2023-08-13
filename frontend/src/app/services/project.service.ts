import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import {
  CreateProjectDto,
  ProjectDto,
} from 'taskapp-common/dist/src/dto/project.dto';
import { Page } from 'taskapp-common/dist/src/dto/list.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<Page<ProjectDto>>('projects');
  }

  create(data: CreateProjectDto) {
    return this.http.post<void>('projects', data);
  }
}

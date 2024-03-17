import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BoardDto,
  CreateBoardDto,
} from 'taskapp-common/dist/src/dto/board.dto';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<BoardDto[]>('boards');
  }

  listByProject(projectId: string) {
    return this.http.get<BoardDto[]>('boards/project/' + projectId);
  }

  create(data: CreateBoardDto) {
    return this.http.post<BoardDto>('boards', data);
  }

  update(id: string, data: CreateBoardDto) {
    return this.http.put<void>('boards/' + id, data);
  }

  delete(id: string) {
    return this.http.delete<void>('boards/' + id);
  }
}

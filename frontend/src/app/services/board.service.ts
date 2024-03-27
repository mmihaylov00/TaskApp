import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BoardDto,
  CreateBoardDto,
} from 'taskapp-common/dist/src/dto/board.dto';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService extends SocketService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  list() {
    return this.http.get<BoardDto[]>('boards');
  }

  get(id: string) {
    return this.http.get<BoardDto>('boards/' + id);
  }

  listen(id: string, subscribe: { [key: string]: (data: any) => void }) {
    this.subscribe('board', subscribe, { boardId: id });
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

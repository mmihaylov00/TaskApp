import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'taskapp-common/dist/src/dto/list.dto';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends SocketService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  getCount() {
    return this.http.get<{ count: number }>('notifications');
  }

  getUnread() {
    return this.http.get<NotificationDto[]>('notifications/unread');
  }

  list() {
    return this.http.get<Page<NotificationDto>>('notifications/list');
  }

  delete(id: string) {
    return this.http.delete<void>('notifications/' + id);
  }

  read(id: string) {
    return this.http.get<void>('notifications/' + id + '/read');
  }

  listen(subscribe: { [key: string]: (data: any) => void }) {
    this.subscribe('notification', subscribe);
  }
}

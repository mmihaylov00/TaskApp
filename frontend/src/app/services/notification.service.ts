import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends SocketService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  list(page: PageRequestDto) {
    return this.http.get<Page<NotificationDto>>(
      'notifications?' + Page.urlParams(page),
    );
  }

  getCount() {
    return this.http.get<{ count: number }>('notifications/count');
  }

  getUnread() {
    return this.http.get<NotificationDto[]>('notifications/unread');
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

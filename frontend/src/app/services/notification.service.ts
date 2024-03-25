import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'taskapp-common/dist/src/dto/list.dto';
import { NotificationDto } from 'taskapp-common/dist/src/dto/notification.dto';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private readonly http: HttpClient) {}

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
}

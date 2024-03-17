import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';
import { Page, PageRequestDto } from 'taskapp-common/dist/src/dto/list.dto';
import { CreateUserDto } from 'taskapp-common/dist/src/dto/user.dto';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private readonly http: HttpClient) {}

  getProfile() {
    return this.http.get<UserDetailsDto>('profile');
  }

  list(page: PageRequestDto) {
    return this.http.get<Page<UserDetailsDto>>('users?' + Page.urlParams(page));
  }

  invite(data: CreateUserDto) {
    return this.http.post<UserDetailsDto>('users', data);
  }

  update(id: string, data: CreateUserDto) {
    return this.http.put<void>('users/' + id, data);
  }

  changeStatus(id: string, status: UserStatus) {
    return this.http.put<void>('users/' + id + '/' + status, undefined);
  }

  find(name: string, users: UserDetailsDto[]) {
    return this.http.post<UserDetailsDto[]>('users/search', {
      name,
      userIds: users.map((user) => user.id),
    });
  }
}

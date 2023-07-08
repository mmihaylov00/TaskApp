import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDetailsDto } from 'taskapp-common/dist/src/dto/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private readonly http: HttpClient) {}

  getProfile() {
    return this.http.get<UserDetailsDto>('profile');
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginRequestDto,
  LoginResponseDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(request: LoginRequestDto) {
    return this.http.post<LoginResponseDto>('auth', request);
  }

  setToken(token) {
    localStorage.setItem('token', token);
    location.reload();
  }

  async logout() {
    localStorage.removeItem('token');
    await this.router.navigate(['/']);
    location.reload();
  }
}

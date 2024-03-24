import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  LoginRequestDto,
  LoginResponseDto,
} from 'taskapp-common/dist/src/dto/auth.dto';
import { Router } from '@angular/router';
import { UserStatus } from 'taskapp-common/dist/src/enums/user-status.enum';

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

  async setToken(response: LoginResponseDto) {
    localStorage.setItem('token', response.token);
    if (response.status === UserStatus.INVITED) {
      await this.router.navigate(['/change-password-setup']);
    }
    location.reload();
  }

  async logout(navigate = true) {
    localStorage.removeItem('token');
    if (navigate) {
      await this.router.navigate(['/']);
    }
    location.reload();
  }
}

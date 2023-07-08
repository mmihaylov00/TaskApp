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
  constructor(private http: HttpClient, private router: Router) {}

  login(request: LoginRequestDto) {
    return this.http.post<LoginResponseDto>('auth', request);
  }

  async logout() {
    localStorage.removeItem('token');
    return this.router.navigate(['/']);
  }
}

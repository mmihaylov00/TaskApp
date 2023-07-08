import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    const headers = token
      ? req.headers.set('Authorization', 'Bearer ' + token)
      : req.headers;

    const cloned = req.clone({
      url: `${environment.backendUrl}/${req.url}`,
      headers,
    });

    return next.handle(cloned).pipe(
      tap({
        error: async (error) => {
          if (error.status === 401) {
            await this.authService.logout();
          }
        },
      }),
    );
  }
}

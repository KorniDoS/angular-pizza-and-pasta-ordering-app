import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
} from '@angular/common/http';
import { take, exhaustMap, first, switchMap, delay } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (
      req.url ==
      'https://api.open-meteo.com/v1/forecast?latitude=44.43&longitude=26.09&hourly=temperature_2m,precipitation&current_weather=true'
    ) {
      return next.handle(req);
    } else {
      return this.authService.user.pipe(
        take(2),
        switchMap((user) => {
          const token: any = JSON.parse(localStorage.getItem('userData')!);

          if (!!token) {
            const requestWithAuthHeader = req.clone({
              setHeaders: {
                'Access-Control-Allow-Origin': '*',
                Authorization: 'Bearer ' + token._token,
              },
              //headers: req.headers.set('Authorization', 'Bearer ' + token._token)
            });

            //console.log('inside auth',token._token)
            console.log(requestWithAuthHeader);
            return next.handle(requestWithAuthHeader);
          } else {
            console.log(
              'User or token are not found, sending request without JWT to',
              req.url
            );

            const noAuthHeader = req.clone({
              setHeaders: { 'Access-Control-Allow-Origin': '*' },
            });
            return next.handle(noAuthHeader);
          }
        })
      );
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  user = new BehaviorSubject<any>(null);
  private tokenExpirationTimer: any;

  apiBaseUrl: string = environment.backendAPIbaseUrl;

  signUp(username: string, password: string, role: string): Observable<any> {
    return this.http.post(this.apiBaseUrl + '/auth/signup', {
      username: username,
      password: password,
      role: role,
    });
  }

  signIn(username: string, password: string): Observable<any> {
    return this.http
      .post(this.apiBaseUrl + '/auth/signin', {
        username: username,
        password: password,
      })
      .pipe(tap((res: any) => this.handleAuthentication(res['accessToken'])));
  }

  handleAuthentication(token: string) {
    console.log(token);
    const decoded_token: { username: string; exp: number; iat: number } =
      jwt_decode(token);

    console.log(decoded_token);

    const expiresAt = new Date(decoded_token.exp * 1000);
    const jsonFriendlyDate = new Date(
      expiresAt.getTime() - expiresAt.getTimezoneOffset() * 60000
    );

    const user = new User(token, jsonFriendlyDate?.toJSON());
    console.log(user);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  autoLogin() {
    console.log('AutoLOG called');
    const userData: any = JSON.parse(localStorage.getItem('userData')!);

    console.log(userData);
    if (!userData) {
      console.log('No local storage');
      return;
    } else {
      const loadedUser = new User(
        userData._token,
        userData._tokenExpirationDate
      );

      if (loadedUser) {
        this.user.next(loadedUser);
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();

        console.log(expirationDuration);
        this.autoLogout(expirationDuration);
      }
    }
  }
  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}

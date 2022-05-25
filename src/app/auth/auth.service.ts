import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | undefined;
  private sessionId = 0;

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getSessionId(): number {
    return this.sessionId;
  }

  public setToken(tokenParam: string|undefined) {
    if (!this.token)
      this.token = tokenParam;
  }

  public setSessionId(sessionIdParam: number) {
    if (!this.sessionId)
      this.sessionId = sessionIdParam;
  }

  login(username: string) {
    // const id = 1;
    // this.http.post<{ token: string, userId: number }>('http://localhost:3000/api/students/login/' + id, username)
    return this.http.post<{token: string; userId: number;}>('http://localhost:3000/api/students/login', {"username": username});
      // .subscribe((response) => {
      //   this.token=response.token;
      //   this.sessionId=response.userId;
      //   console.log(response);
      // });
  }

  logout() {
    // clear token
    this.token = '';
    // this.isAuthenticated = false;
    // this.authStatusListener.next(false);
    // clearTimeout(this.tokenTimer);
    // this.clearAuthData();

    this.router.navigate(["/"]);
  }
}

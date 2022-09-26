import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined;
  private sessionId = 0;
  private shown: boolean = false;
  private authStatusListener = new Subject<Boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    if (!this.token) {
      let savedToken: any = localStorage.getItem("token");
      this.token = savedToken;
    }

    return this.token;
  }

  getShown() {
    return this.shown;
  }

  setShown(value:boolean) {
    this.shown = value;
  }

  getSessionId(): number {
    if (!this.sessionId) {
      let userId: any = localStorage.getItem("sessionId");
      let userIdNumber = Number.parseInt(userId);
      this.sessionId = userIdNumber;
    }

    return this.sessionId;
  }

  getIsAuthenticated(): Boolean {
    return this.isAuthenticated;
  }

  public setToken(tokenParam: string|undefined) {
    if (!this.token) {
      this.token = tokenParam;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      localStorage.setItem("token", this.token!);
    }
  }

  public setSessionId(sessionIdParam: number) {
    if (!this.sessionId) {
      this.sessionId = sessionIdParam;
      localStorage.setItem("sessionId", this.sessionId.toString());
    }
  }

  login(username: string, affiliation: string) {
    // const id = 1;
    // this.http.post<{ token: string, userId: number }>('http://localhost:3000/api/students/login/' + id, username)
    return this.http.post<{token: string; userId: number;}>(API_URL + '/' + affiliation + '/login', {"username": username});
  }

  ssoTestLogin() {
    return this.http.get(API_URL + '/authSSO');
  }

  loginWithPassword(username: string, password: string) {
    console.log(username + "|" + password);
    this.shown = true;
    this.http.post<{token: string; userId: number;}>(API_URL + '/company/login', {"username": username, "password": password})
     .subscribe((response) => {
        this.token = response.token;
        this.sessionId = response.userId;
        if (this.token) {
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          this.saveAuthData(this.token, /*expirationDate,*/ this.sessionId);
          this.router.navigate(['/companies/' + this.sessionId]);
        }
      }, error => {
        alert("Λάθος στοιχεία χρήστη");
        location.reload();
    });
  }

  private saveAuthData(token: string, /*expirationDate: Date,*/ userId: number) {
    localStorage.setItem("token", token);
    //localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("sessionId", userId.toString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    //localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.removeItem("sessionId");
  }

  logout() {
    // clear token
    this.token = '';
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    // clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(["/"]);
  }
}

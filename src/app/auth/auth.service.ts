import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from "src/environments/environment";

const API_URL = environment.apiUrl;
// While the user is active, the token is renewed when less than this time is left
const REFRESH_BEFORE_EXPIRY_MS = 30 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string | undefined;
  private sessionId = 0;
  private shown: boolean = false;
  private authStatusListener = new Subject<Boolean>();
  private tokenTimer: any;
  private isRefreshing = false;

  constructor(private http: HttpClient, private router: Router) {
    // An expired token is kept until a protected page is opened (the guard then informs the user),
    // it is not cleared here because the user may be arriving from the SSO login with a new token
    const savedToken = localStorage.getItem("token");
    if (savedToken && !this.isTokenExpired(savedToken)) {
      this.startTokenTimer(savedToken);
    }
  }

  getToken() {
    if (!this.token) {
      let savedToken: any = localStorage.getItem("token");
      this.token = savedToken;
    }

    // Do not send an expired token
    if (this.token && this.isTokenExpired(this.token)) {
      return undefined;
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

  isLoggedIn(): boolean {
    const token = this.token || localStorage.getItem("token");
    return !!token && !this.isTokenExpired(token);
  }

  getIsAuthenticated(): Boolean {
    return this.isAuthenticated;
  }

  public setToken(tokenParam: string|undefined) {
    // A new login always replaces a previous (possibly expired) token
    if (tokenParam) {
      this.token = tokenParam;
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
      localStorage.setItem("token", this.token);
      this.startTokenTimer(this.token);
    }
  }

  public setSessionId(sessionIdParam: number) {
    if (sessionIdParam) {
      this.sessionId = sessionIdParam;
      localStorage.setItem("sessionId", this.sessionId.toString());
    }
  }

  /**
   * Called on every request of the user (activity), renews the token
   * when it is close to expiring, so that active users are not logged out
   */
  refreshTokenIfNeeded() {
    const token = this.getToken();
    if (!token || this.isRefreshing) {
      return;
    }

    if (this.getTokenExpiration(token) - Date.now() > REFRESH_BEFORE_EXPIRY_MS) {
      return;
    }

    this.isRefreshing = true;
    this.http.post<{token: string; userId: number;}>(API_URL + '/auth/refresh', {})
      .subscribe((response) => {
        this.isRefreshing = false;
        this.setToken(response.token);
      }, () => {
        this.isRefreshing = false;
      });
  }

  /**
   * Logs the user out because the session expired (or the token was rejected)
   * and informs the user, if he was logged in
   */
  sessionExpired() {
    const wasLoggedIn = !!(this.token || localStorage.getItem("token"));
    this.logout();

    if (wasLoggedIn) {
      Swal.fire({
        title: 'Λήξη συνεδρίας',
        text: 'Η συνεδρία σας έληξε. Παρακαλώ συνδεθείτε ξανά.',
        icon: 'warning',
        confirmButtonText: 'Εντάξει'
      });
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
          this.saveAuthData(this.token, this.sessionId);
          this.startTokenTimer(this.token);
          this.router.navigate(['/companies/' + this.sessionId]);
        }
      }, error => {
        alert("Λάθος στοιχεία χρήστη");
        location.reload();
    });
  }

  private saveAuthData(token: string, userId: number) {
    localStorage.setItem("token", token);
    localStorage.setItem("sessionId", userId.toString());
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("sessionId");
  }

  /**
   * Reads the expiration date (exp claim) of a jwt token
   * @returns expiration time in ms, or 0 if the token cannot be decoded
   */
  private getTokenExpiration(token: string): number {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(payload)).exp * 1000;
    } catch {
      return 0;
    }
  }

  private isTokenExpired(token: string): boolean {
    return this.getTokenExpiration(token) <= Date.now();
  }

  // Logs the user out automatically when the token expires
  private startTokenTimer(token: string) {
    clearTimeout(this.tokenTimer);
    const expiresInMs = this.getTokenExpiration(token) - Date.now();
    if (expiresInMs <= 0) {
      this.sessionExpired();
      return;
    }
    this.tokenTimer = setTimeout(() => this.sessionExpired(), expiresInMs);
  }

  logout() {
    // clear token
    this.token = '';
    this.sessionId = 0;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.router.navigate(["/"]);
  }
}

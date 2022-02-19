import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | undefined;
  private sessionId = 0;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  getSessionId(): number {
    return this.sessionId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  login(username: string) {
    const id = 1;
    this.http.post<{ token: string, userId: number }>('http://localhost:3000/api/students/login/' + id, username)
      .subscribe((response) => {
        this.token = response.token;
        this.sessionId = response.userId;
        this.authStatusListener.next(true);
        console.log(response);
      });
  }
}

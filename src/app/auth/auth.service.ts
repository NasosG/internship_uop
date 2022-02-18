import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | undefined;
  constructor(private http: HttpClient) {}

  getToken() {
    return this.token;
  }

  login(username: string) {
    const id = 1;
    this.http.post<{ token: string }>('http://localhost:3000/api/students/login/' + id, username)
      .subscribe((response) => {
        this.token = response.token;
        console.log(response);
      });
  }
}

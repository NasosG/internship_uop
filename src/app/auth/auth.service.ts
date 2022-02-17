import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username:string) {
    const id = 1;
    this.http.post("http://localhost:3000/api/students/login/" + id, username)
    .subscribe(response => {
      console.log(response);
    });
  }

}

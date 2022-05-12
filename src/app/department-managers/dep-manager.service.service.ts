import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from "./dep-manager.model";

@Injectable({
  providedIn: 'root'
})
export class DepManagerService {

  public manager: DepManager[] = [];
  public fetchedManagerObservable!: Observable<Array<DepManager>>;

  constructor(private http: HttpClient, public authService: AuthService) { }

  getDepManager(): Observable<Array<DepManager>> {
    const id = 2;
    const fetchedmanager = this.http.get<Array<DepManager>>('http://localhost:3000/api/depmanager/getDepManagerById/' + id);
    this.fetchedManagerObservable = fetchedmanager;
    this.fetchedManagerObservable.subscribe((managers: DepManager[]) => {
      this.manager = [...managers];
    });
    return fetchedmanager;
  }
}

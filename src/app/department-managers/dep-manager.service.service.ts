import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from "./dep-manager.model";
import { Period } from './period.model';

@Injectable({
  providedIn: 'root'
})
export class DepManagerService {

  public managerArray: DepManager[] = [];
  public manager!: DepManager;
  public fetchedManagerArrayObservable!: Observable<Array<DepManager>>;
  public fetchedManagerObservable!: Observable<DepManager>;
  constructor(private http: HttpClient, public authService: AuthService) { }

  getDepManager(): Observable<DepManager> {
    const id = 2;
    const fetchedmanager = this.http.get<DepManager>("http://localhost:3000/api/depmanager/getDepManagerById/" + id);
    this.fetchedManagerObservable = fetchedmanager;
    this.fetchedManagerObservable.subscribe((managers: DepManager) => {
      this.manager = managers;
    });
    return fetchedmanager;
  }

  insertPeriod(inputForm: any) {
    const depManagerId = 2;
    const form: Period = inputForm;
    // console.log(inputForm);
    this.http
      .post<{ message: string }>("http://localhost:3000/api/depmanager/insertPeriod/" + depManagerId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

}

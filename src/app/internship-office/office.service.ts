export class Office {
}
import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from '../department-managers/period.model';
import { OfficeUser } from './office-user.model';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  public officeUserArray: OfficeUser[] = [];
  public officeUser!: OfficeUser;
  public period!: Period;
  public officeUserObservable!: Observable<OfficeUser>;
  public fetchedPeriodObservable!: Observable<Period>;

  constructor(private http: HttpClient, public authService: AuthService) { }

  getDepartmentId() {
    return this.officeUser.department_id;
  }

  getOfficeUser(): Observable<OfficeUser> {
    const id = 6;
    const fetchedOfficeUser = this.http.get<OfficeUser>("http://localhost:3000/api/office/getOfficeUserById/" + id);
    this.officeUserObservable = fetchedOfficeUser;
    this.officeUserObservable.subscribe((managers: OfficeUser) => {
      this.officeUser = managers;
    });
    return fetchedOfficeUser;
  }

  getPeriodByDepartmentId(): Observable<Period> {
    const id = 98;
    const fetchedPeriod = this.http.get<Period>("http://localhost:3000/api/office/getPeriodByDepartmentId/" + id);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
  }

  insertEspaPosition(data: number, departmentId: number) {
    this.http
      .post<{ message: string }>("http://localhost:3000/api/office/insertEspaPosition/" + departmentId, { "positions": data })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

}

export class Office {
}
import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from '../department-managers/period.model';
import { OfficeUser } from './office-user.model';
import { environment } from "src/environments/environment";

const OFFICE_URL = environment.apiUrl + "/office/";

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
    const id = this.authService.getSessionId();
    const fetchedOfficeUser = this.http.get<OfficeUser>(OFFICE_URL + "getOfficeUserById/" + id);
    this.officeUserObservable = fetchedOfficeUser;
    this.officeUserObservable.subscribe((managers: OfficeUser) => {
      this.officeUser = managers;
    });
    return fetchedOfficeUser;
  }

  getPeriodByDepartmentId(departmentId: number): Observable<Period> {
    const fetchedPeriod = this.http.get<Period>(OFFICE_URL + "getPeriodByDepartmentId/" + departmentId);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
  }

  insertEspaPosition(data: number, departmentId: number) {
    this.http
      .post<{ message: string }>(OFFICE_URL + "insertEspaPosition/" + departmentId, { "positions": data })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateEntrySheetField(formId: number, fieldId: string, elementValue: boolean): Observable<any> {
    return this.http
      .put<{ message: string }>(OFFICE_URL + "updateEntrySheetField/" + formId, { "fieldId": fieldId, "elementValue": elementValue });
  }

  updateExitSheetField(formId: number, fieldId: string, elementValue: boolean): Observable<any> {
    return this.http
      .put<{ message: string }>(OFFICE_URL + "updateExitSheetField/" + formId, { "fieldId": fieldId, "elementValue": elementValue });
  }

}

import { Injectable } from '@angular/core';
import { mergeMap, Observable, of, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Period } from '../department-managers/period.model';
import { OfficeUser } from './office-user.model';
import { environment } from "src/environments/environment";
import { ExitForm } from '../students/exit-form.model';
import { EntryForm } from '../students/entry-form.model';

const OFFICE_URL = environment.apiUrl + "/office/";
const STUDENTS_URL = environment.apiUrl + "/students/";
const OPS_URL = environment.apiUrl + "/ops/";

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

  // getStudentsWithSheetInput(departmentId: number): Observable<Array<any>> {
  //   return this.http
  //     .get<Array<any>>(OFFICE_URL + "getStudentsWithSheetInput/" + departmentId);
  // }

  // getStudentsWithSheetOutput(departmentId: number): Observable<Array<any>> {
  //   return this.http
  //     .get<Array<any>>(OFFICE_URL + "getStudentsWithSheetOutput/" + departmentId);
  // }

  getStudentsWithSheetInput(periodId: number): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(OFFICE_URL + "getStudentsWithSheetInput/" + periodId);
  }

  getStudentsWithSheetOutput(periodId: number): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(OFFICE_URL + "getStudentsWithSheetOutput/" + periodId);
  }

  getStudentEntrySheetsByStudentId(studentId: string): Observable<Array<EntryForm>> {
    return this.http
      .get<Array<EntryForm>>(STUDENTS_URL + 'getStudentEntrySheets/' + studentId);
  }

  getStudentExitSheetsByStudentId(studentId: string): Observable<Array<ExitForm>> {
    return this.http
      .get<Array<ExitForm>>(STUDENTS_URL + 'getStudentExitSheets/' + studentId);
  }

  getAcademicsByOfficeUserId(): Observable<Array<any>> {
    const officeUserId = this.authService.getSessionId();
    return this.http
      .get<Array<any>>(OFFICE_URL + "getAcademicsByOfficeUserId/" + officeUserId);
  }

  getEspaPositionsByDepartmentId(academicId: any): Observable<any> {
    return this.http.get<any>(OFFICE_URL + "getEspaPositionsByDepartmentId/" + academicId);
  }

  getStudentListForPeriodAndAcademic(departmentId: number, periodId: number): Observable<any> {
    const params = new HttpParams()
      .set('departmentId', departmentId)
      .set('periodId', periodId == null ? 0 : periodId);
    return this.http.get<any>(OFFICE_URL + "getStudentListForPeriodAndAcademic/", { params });
  }

  sendSheetWS(studentId: number, type: string): Observable<any> {
    switch (type) {
      case "entry":
        return this.http.post<any>(OPS_URL + "sendDeltioEisodouWS/" + studentId, {});
      case "exit":
        return this.http.post<any>(OPS_URL + "sendDeltioExodouWS/" + studentId, {});
      default:
        return of([]);
    }
  }
}

import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from "./dep-manager.model";
import { Period } from './period.model';
import { Student } from '../students/student.model';
import {ActiveApplication} from './active-application.model';

@Injectable({
  providedIn: 'root'
})
export class DepManagerService {

  public managerArray: DepManager[] = [];
  public manager!: DepManager;
  public period!: Period;
  public activeApplications!: ActiveApplication[];
  public fetchedManagerArrayObservable!: Observable<Array<DepManager>>;
  public fetchedManagerObservable!: Observable<DepManager>;
  public fetchedPeriodObservable!: Observable<Period>;
  public fetchedStudentObservable!: Observable<Student>;
  students!: Student;

  constructor(private http: HttpClient, public authService: AuthService) { }

  getDepartmentId() {
    return this.manager.department_id;
  }

  getDepManager(): Observable<DepManager> {
    const id = 2;
    const fetchedManager = this.http.get<DepManager>("http://localhost:3000/api/depmanager/getDepManagerById/" + id);
    this.fetchedManagerObservable = fetchedManager;
    this.fetchedManagerObservable.subscribe((managers: DepManager) => {
      this.manager = managers;
    });
    return fetchedManager;
  }

  getPeriodByUserId(): Observable<Period> {
    const id = 2;
    const fetchedPeriod = this.http.get<Period>("http://localhost:3000/api/depmanager/getPeriodByUserId/" + id);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
  }

  getStudentsApplyPhase(): Observable<Student[]> {
    const fetchedStudent = this.getDepManager()
      .pipe(
        mergeMap(result => this.getStudentsApplyPhaseByDeptId(result?.department_id))
      )
    return fetchedStudent;
  }

  getStudentsApplyPhaseByDeptId(departmentId: number): Observable<Student[]> {
    const fetchedStudent = this.http.get<Student[]>("http://localhost:3000/api/depmanager/getStudentsApplyPhase/" + departmentId);
    // this.fetchedStudentObservable = fetchedStudent;
    // this.fetchedStudentObservable.subscribe((students: Student[]) => {
    //   this.students = students;
    // });
    return fetchedStudent;
  }

  getRankedStudentsByDeptId(departmentId: number): Observable<Student[]> {
    const fetchedStudent = this.http.get<Student[]>("http://localhost:3000/api/depmanager/getRankedStudentsByDeptId/" + departmentId);

    return fetchedStudent;
  }

  getStudentActiveApplications(departmentId: number): Observable<Array<ActiveApplication>> {
    return this.http
      .get<Array<ActiveApplication>>("http://localhost:3000/api/depmanager/getStudentActiveApplications/" + departmentId);
  }

  insertPeriod(inputForm: any, departmentId: number) {
    const depManagerId = 2;
    const form: Period = inputForm;

    const params = new HttpParams()
      .set('depManagerId', depManagerId)
      .set('departmentId', departmentId);

    this.http
      .post<{ message: string }>("http://localhost:3000/api/depmanager/insertPeriod/", form, { params })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertApprovedStudentsRank(depId: number, phase: number) {
    this.http
      .post<{ message: string }>("http://localhost:3000/api/depmanager/insertApprovedStudentsRank/" + depId, { 'phase': phase })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  receiveFile(studentId: number, docType: string): Observable<Blob> {
    const url = "http://localhost:3000/api/students/sendFile/" + studentId;
    return this.http.post(url, { 'doctype': docType }, { responseType: 'blob' });
    // .pipe(
    //   takeWhile( () => this.alive),
    //   filter ( image => !!image));
  }

  updatePeriodById(inputForm: any, periodId: number) {
    const form: Period = inputForm;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/depmanager/updatePeriodById/" + periodId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  deletePeriodById(periodId: number) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/depmanager/deletePeriodById/" + periodId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updatePhaseByStudentId(phase: number, studentId: number) {
    const phaseJson: any = { 'phase': phase };
    console.log(phaseJson);
    this.http
      .put<{ message: string }>("http://localhost:3000/api/depmanager/updatePhaseByStudentId/" + studentId, phaseJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentRanking(positionsArray: Array<Student>, departmentId: number) {
    const form: Array<Student> = positionsArray;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/depmanager/updateStudentRanking/" + departmentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }
}

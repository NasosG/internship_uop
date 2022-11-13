import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from "./dep-manager.model";
import { Period } from './period.model';
import { Student } from '../students/student.model';
import { ActiveApplication } from './active-application.model';
import { environment } from "src/environments/environment";

const STUDENTS_URL = environment.apiUrl + "/students/";
const DEPARTMENT_MANAGER_URL = environment.apiUrl + "/depmanager/";

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
    const id = this.authService.getSessionId();
    const fetchedManager = this.http.get<DepManager>(DEPARTMENT_MANAGER_URL + "getDepManagerById/" + id);
    this.fetchedManagerObservable = fetchedManager;
    this.fetchedManagerObservable.subscribe((managers: DepManager) => {
      this.manager = managers;
    });
    return fetchedManager;
  }

  getPeriodByUserId(): Observable<Period> {
    const id = this.authService.getSessionId();
    const fetchedPeriod = this.http.get<Period>(DEPARTMENT_MANAGER_URL + "getPeriodByUserId/" + id);
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
    const fetchedStudent = this.http.get<Student[]>(DEPARTMENT_MANAGER_URL + "getStudentsApplyPhase/" + departmentId);
    // this.fetchedStudentObservable = fetchedStudent;
    // this.fetchedStudentObservable.subscribe((students: Student[]) => {
    //   this.students = students;
    // });
    return fetchedStudent;
  }

  getRankedStudentsByDeptId(departmentId: number): Observable<Student[]> {
    const fetchedStudent = this.http.get<Student[]>(DEPARTMENT_MANAGER_URL + "getRankedStudentsByDeptId/" + departmentId);

    return fetchedStudent;
  }

  getStudentActiveApplications(departmentId: number): Observable<Array<ActiveApplication>> {
    return this.http
      .get<Array<ActiveApplication>>(DEPARTMENT_MANAGER_URL + "getStudentActiveApplications/" + departmentId);
  }

  insertPeriod(inputForm: any, departmentId: number) {
    const depManagerId = this.authService.getSessionId();
    const form: Period = inputForm;

    const params = new HttpParams()
      .set('depManagerId', depManagerId)
      .set('departmentId', departmentId);

    this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertPeriod/", form, { params })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertApprovedStudentsRank(depId: number, phase: number) {
    this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertApprovedStudentsRank/" + depId, { 'phase': phase })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  receiveFile(studentId: number, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "sendFile/" + studentId;
    return this.http.post(url, { 'doctype': docType }, { responseType: 'blob' });
    // .pipe(
    //   takeWhile( () => this.alive),
    //   filter ( image => !!image));
  }

  updatePeriodById(inputForm: any, periodId: number) {
    const form: Period = inputForm;
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updatePeriodById/" + periodId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  deletePeriodById(periodId: number) {
    this.http
      .delete<{ message: string }>(DEPARTMENT_MANAGER_URL + "deletePeriodById/" + periodId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updatePhaseByStudentId(phase: number, studentId: number) {
    const phaseJson: any = { 'phase': phase };
    console.log(phaseJson);
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updatePhaseByStudentId/" + studentId, phaseJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentRanking(positionsArray: Array<Student>, departmentId: number) {
    const form: Array<Student> = positionsArray;
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updateStudentRanking/" + departmentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertCommentsByStudentId(studentId: number, comments: string) {
    const commentsJson: any = { 'comments': comments };
    this.http
      .post<{ message: string }>("http://localhost:3000/api/depmanager/insertCommentsByStudentId/" + studentId, commentsJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateCommentsByStudentId(studentId: number, comments: string) {
    const commentsJson: any = { 'comments': comments};
    this.http
      .put<{ message: string }>("http://localhost:3000/api/depmanager/updateCommentsByStudentId/" + studentId, commentsJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  getCommentByStudentIdAndSubject(studentId: number, subject: string): Observable<any> {
     const params = new HttpParams()
      .set('studentId', studentId)
      .set('subject', subject);
    const fetchedComment = this.http.get<any>("http://localhost:3000/api/depmanager/getCommentByStudentIdAndSubject/", { params });
    return fetchedComment;
  }
}

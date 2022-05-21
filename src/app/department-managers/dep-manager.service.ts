import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from "./dep-manager.model";
import { Period } from './period.model';
import { Student } from '../students/student.model';

@Injectable({
  providedIn: 'root'
})
export class DepManagerService {

  public managerArray: DepManager[] = [];
  public manager!: DepManager;
  public period!: Period;
  public fetchedManagerArrayObservable!: Observable<Array<DepManager>>;
  public fetchedManagerObservable!: Observable<DepManager>;
  public fetchedPeriodObservable!: Observable<Period>;
  public fetchedStudentObservable!: Observable<Student>;
  students!: Student;

  constructor(private http: HttpClient, public authService: AuthService) { }

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
    const id = 98;
    const fetchedStudent = this.http.get<Student[]>("http://localhost:3000/api/depmanager/getStudentsApplyPhase/" + id);
    // this.fetchedStudentObservable = fetchedStudent;
    // this.fetchedStudentObservable.subscribe((students: Student[]) => {
    //   this.students = students;
    // });
    return fetchedStudent;
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

}

import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { EntryForm } from "./entry-form.model";
import { ExitForm } from "./exit-form.model";
import { EvaluationForm } from "./evaluation-form.model";
import { StudentPositions } from "./student-positions.model";
import { Application } from "./application.model";
import { AtlasPosition } from "./atlas-position.model";
import { Department } from "./department.model";
import { Prefecture } from "./prefecture.model";
import { City } from "./city.model";
import { Period } from "../department-managers/period.model";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public period!: Period;
  public fetchedStudentsObservable!: Observable<Array<Student>>;
  // private studentsUpdated = new Subject<Student[]>();
  public fetchedPeriodObservable!: Observable<Period>;
  constructor(private http: HttpClient, public authService: AuthService) { }

  // getStudentUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }

  getStudents(): Observable<Array<Student>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Student>>('http://localhost:3000/api/students/getStudentById/' + id);
    this.fetchedStudentsObservable = fetchedStudents;
    this.fetchedStudentsObservable.subscribe((students: Student[]) => {
      this.students = [...students];
    });
    return fetchedStudents;

    // .subscribe(postData => {
    //   this.students = postData;
    //   console.log(postData);
    //   this.studentsUpdated.next([...this.students]);
    // });
  }

  getFetchedPeriodObservable(): Observable<Period> {
    return this.fetchedPeriodObservable;
  }

  getStudentEntrySheets(): Observable<Array<EntryForm>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<EntryForm>>('http://localhost:3000/api/students/getStudentEntrySheets/' + studentId);
  }

  getStudentExitSheets(): Observable<Array<ExitForm>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<ExitForm>>('http://localhost:3000/api/students/getStudentExitSheets/' + studentId);
  }

  getStudentEvaluationSheets(): Observable<Array<EvaluationForm>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<EvaluationForm>>('http://localhost:3000/api/students/getStudentEvaluationSheets/' + studentId);
  }

  getStudentPositions(): Observable<Array<StudentPositions>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<StudentPositions>>('http://localhost:3000/api/students/getStudentPositions/' + studentId);
  }

  getStudentApplications(): Observable<Array<Application>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<Application>>('http://localhost:3000/api/students/getStudentApplications/' + studentId);
  }

  // get active application
  getStudentActiveApplication(): Observable<number> {
    const studentId = this.authService.getSessionId();
    console.log("of user: " + this.authService.getSessionId());
    return this.http
      .get<number>('http://localhost:3000/api/students/getStudentActiveApplication/' + studentId);
  }

  getAtlasPositions(begin: number): Observable<Array<AtlasPosition>> {
    return this.http
      .get<Array<AtlasPosition>>('http://localhost:3000/api/atlas/getAvailablePositionGroups/' + begin);
  }

  getAtlasFilteredPositions(begin: number, filterArray: any): Observable<Array<AtlasPosition>> {
    let filterData = JSON.parse(JSON.stringify(filterArray));
    return this.http
      .post<Array<AtlasPosition>>('http://localhost:3000/api/atlas/getAtlasFilteredPositions/' + begin, filterData);
  }

  getAtlasInstitutions(): Observable<Array<Department>> {
    return this.http
      .get<Array<Department>>('http://localhost:3000/api/atlas/getInstitutions/');
  }

  getAtlasCities(): Observable<Array<City>> {
    return this.http.get<Array<City>>('http://localhost:3000/api/atlas/getCities/');
  }

  getPhase(departmentId: number): Observable<Period> {
    // fetchedPeriodObservable
    const fetchedPeriod = this.http.get<Period>('http://localhost:3000/api/students/getPhase/' + departmentId);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
    // return this.http.get<Period>('http://localhost:3000/api/students/getPhase/' + departmentId);
  }

  getPeriod(): any {
    if (!this.period) return null;
    return this.period;
  }

  // public fetchStudentsAndPeriod() {
  //   let studentPeriodArray: any;
  //   let fetchedStudents: any[];
  //   let fetchedPeriod;
  //     this.getStudents()
  //     .subscribe((students: Student[]) => {
  //       fetchedStudents = students;
  //        this.getPhase(fetchedStudents[0]?.department_id)
  //         .subscribe((period: Period) => {
  //           fetchedPeriod = period;
  //           studentPeriodArray = Object.assign({"student" : fetchedStudents}, {"period": period});
  //           console.log("asd" + studentPeriodArray["period"].date_from);
  //           this.period =  studentPeriodArray["period"];
  //           console.log( "asd" + this.period.date_from);
  //           return this.period;
  //         });
  //     });
  // }
  public fetchStudentsAndPeriod(): Observable<Period> {
    let studentPeriodArray: any;
    let fetchedStudents: any[];
    let fetchedPeriod;
    const period = this.getStudents()
      .pipe(
        mergeMap(result => this.getPhase(result[0]?.department_id))
      )
    return period;
  }

  // this functions adds a new bio and details to a student
  updateStudentDetails(data: any) {
    const id = this.authService.getSessionId();
    // const student: string = modelStudent;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentContractDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContractDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContractSSNFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentSSNFile/" + id, file);
    // .subscribe(responseData => {
    // console.log("ssn " + responseData.message);
    // return responseData.message;
    // });
  }

  updateStudentContractIbanFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentIbanFile/" + id, file);
    // .subscribe(responseData => {
    //   console.log(responseData.message);
    //   return responseData.message;
    // });
  }

  updateStudentBio(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentBio/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContact(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentSpecialDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentSpecialDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentEntrySheet(data: any) {
    const studentId = this.authService.getSessionId();
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentEntrySheet/" + studentId, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentEntrySheet(inputForm: any) {
    const studentId = this.authService.getSessionId();
    const form: EntryForm = inputForm;
    // console.log(inputForm);
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentEntrySheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentExitSheet(exitForm: any) {
    const studentId = this.authService.getSessionId();
    const form: ExitForm = exitForm;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentExitSheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentEvaluationSheet(evaluationForm: any) {
    const studentId = this.authService.getSessionId();
    const form: EvaluationForm = evaluationForm;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentEvaluationSheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentApplication(positions: StudentPositions[]) {
    const studentId = this.authService.getSessionId();
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentApplication/" + studentId, positions)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentPosition(positionId: number, atlas: boolean) {
    const studentId = this.authService.getSessionId();
    if (atlas)
      return this.http
        .post<{ message: string }>("http://localhost:3000/api/students/insertStudentPosition/" + studentId, { positionId });
    else
      return this.http
        .post<{ message: string }>("http://localhost:3000/api/students/insertStudentPosition/" + studentId, { 'internal_position_id': positionId });
  }

  // Not currently used
  // deleteStudentPosition(positionPriority: number) {
  //   this.http
  //     .delete<{ message: string }>("http://localhost:3000/api/students/deletePositionByStudentId/" + positionPriority)
  //     .subscribe(responseData => {
  //       console.log(responseData.message);
  //     });
  // }

  deleteStudentPositions(studentId: number) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/students/deletePositionsByStudentId/" + studentId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  deleteApplicationById(applicationId: number) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/students/deleteApplicationById/" + applicationId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentPositionPriorities(positionPriority: number) {
    let id = this.authService.getSessionId();
    const form: any = { 'priority': positionPriority, 'student_id': id };
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentPositionPriorities/" + positionPriority, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentPositions(positionsArray: Array<StudentPositions>) {
    const studentId = this.authService.getSessionId();
    const form: Array<StudentPositions> = positionsArray;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentPositions/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updatePhase(phase: number) {
    const studentId = this.authService.getSessionId();
    const phaseJson: any = { 'phase': phase };
    console.log("phase " + phaseJson);
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updatePhase/" + studentId, phaseJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

}

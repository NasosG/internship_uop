import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { EntryForm } from "./entry-form.model";
import { ExitForm } from "./exit-form.model";
import { EvaluationForm } from "./evaluation-form.model";
import { StudentPositions } from "./student-positions.model";
import { Application } from "./application.model";
import { AtlasPosition } from "./atlas-position.model";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public fetchedStudentsObservable!: Observable<Array<Student>>;
  // private studentsUpdated = new Subject<Student[]>();

  constructor(private http: HttpClient, public authService: AuthService) { }

  // getStudentUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }

  getStudents(): Observable<Array<Student>> {
    const fetchedStudents = this.http.get<Array<Student>>('http://localhost:3000/api/students');
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

  getStudentEntrySheets(): Observable<Array<EntryForm>> {
    const studentId = 1;
    return this.http
      .get<Array<EntryForm>>('http://localhost:3000/api/students/getStudentEntrySheets/' + studentId);
  }

  getStudentExitSheets(): Observable<Array<ExitForm>> {
    const studentId = 1;
    return this.http
      .get<Array<ExitForm>>('http://localhost:3000/api/students/getStudentExitSheets/' + studentId);
  }

  getStudentEvaluationSheets(): Observable<Array<EvaluationForm>> {
    const studentId = 1;
    return this.http
      .get<Array<EvaluationForm>>('http://localhost:3000/api/students/getStudentEvaluationSheets/' + studentId);
  }

  getStudentPositions(): Observable<Array<StudentPositions>> {
    const studentId = 1;
    return this.http
      .get<Array<StudentPositions>>('http://localhost:3000/api/students/getStudentPositions/' + studentId);
  }

  getStudentApplications(): Observable<Array<Application>> {
    const studentId = 1;
    return this.http
      .get<Array<Application>>('http://localhost:3000/api/students/getStudentApplications/' + studentId);
  }

  getAtlasPositions(): Observable<AtlasPosition> {
    // const studentId = 1;
    return this.http
      .get<AtlasPosition>('http://localhost:3000/api/atlas/getAvailablePositionGroups/');
  }

  // this functions adds a new bio and details to a student
  updateStudentDetails(data: any) {
    const id = 1;
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
    const id = 1;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContractDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContractSSNFile(file: any) {
    const id = 1;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentSSNFile/" + id, file)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContractIbanFile(file: any) {
    const id = 1;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentIbanFile/" + id, file)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentBio(data: any) {
    const id = 1;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentBio/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContact(data: any) {
    const id = 1;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentEntrySheet(data: any) {
    const studentId = 1;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentEntrySheet/" + studentId, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentEntrySheet(inputForm: any) {
    const studentId = 1;
    const form: EntryForm = inputForm;
    // console.log(inputForm);
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentEntrySheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentExitSheet(exitForm: any) {
    const studentId = 1;
    const form: ExitForm = exitForm;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentExitSheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentEvaluationSheet(evaluationForm: any) {
    const studentId = 1;
    const form: EvaluationForm = evaluationForm;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentEvaluationSheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentApplication(positions: StudentPositions[]) {
    const studentId = 1;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/insertStudentApplication/" + studentId, positions)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  // Not currently used
  // deleteStudentPosition(positionPriority: number) {
  //   this.http
  //     .delete<{ message: string }>("http://localhost:3000/api/students/deletePositionByStudentId/" + positionPriority)
  //     .subscribe(responseData => {
  //       console.log(responseData.message);
  //     });
  // }


  deleteStudentPositions(studenId: number) {
    this.http
      .delete<{ message: string }>("http://localhost:3000/api/students/deletePositionsByStudentId/" + studenId)
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
    const form: any = { 'priority': positionPriority, 'student_id': 1 };
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentPositionPriorities/" + positionPriority, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentPositions(positionsArray: Array<StudentPositions>) {
    const studentId = 1;
    const form: Array<StudentPositions> = positionsArray;
    this.http
      .put<{ message: string }>("http://localhost:3000/api/students/updateStudentPositions/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

}

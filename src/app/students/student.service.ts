import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import {EntryForm} from "./entry-form.model";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public fetchedStudentsObservable!:Observable<Array<Student>>;
  // private studentsUpdated = new Subject<Student[]>();

  constructor(private http: HttpClient, public authService: AuthService) {}

  // getStudentUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }

  getStudents() : Observable<Array<Student>> {
    const fetchedStudents =  this.http.get<Array<Student>>('http://localhost:3000/api/students');
    this.fetchedStudentsObservable = fetchedStudents;
    this.fetchedStudentsObservable.subscribe((students: Student[]) => {
        this.students = students;
    });
    return fetchedStudents;
      // .subscribe(postData => {
      //   this.students = postData;
      //   console.log(postData);
      //   this.studentsUpdated.next([...this.students]);
      // });
  }

  getStudentEntrySheets() : Observable<Array<EntryForm>> {
    const studentId = 1;
    return this.http
      .get<Array<EntryForm>>('http://localhost:3000/api/students/getStudentEntrySheets/' + studentId);
  }

  // this functions adds a new bio and details to a student
  updateStudentDetails(data: any) {
    const id = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentContractDetails(data: any) {
    const id = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentContractDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentContractSSNFile(file: any) {
    const id = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentSSNFile/" + id, file)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentContractIbanFile(file: any) {
    const id = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentIbanFile/" + id, file)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentBio(data: any) {
    const id = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentBio/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentContact(data: any) {
    const id = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentEntrySheet(data: any) {
    const studentId = 1;
    // const student: string = modelStudent;
    this.http
      .post<{ message: string }>("http://localhost:3000/api/students/updateStudentEntrySheet/" + studentId, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
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
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

}


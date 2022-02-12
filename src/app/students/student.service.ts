import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class StudentsService {
  // private students: Student[] = [];
  // private studentsUpdated = new Subject<Student[]>();

  constructor(private http: HttpClient) {}

  // getStudentUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }

  getStudents() : Observable<Array<Student>> {
    return this.http
      .get<Array<Student>>('http://localhost:3000/api/students');
      // .subscribe(postData => {
      //   this.students = postData;
      //   console.log(postData);
      //   this.studentsUpdated.next([...this.students]);
      // });
  }

  // this functions adds a new bio and details to a student
  // addStudentBio(modelStudent: Student) {
  //   const student: Student = modelStudent;
  //   this.http
  //     .post<{ message: string }>("http://localhost:3000/api/students/addBio", this.students)
  //     .subscribe(responseData => {
  //       console.log(responseData.message);
  //       this.students.push(student);
  //       // this.studentsUpdated.next([...this.students]);
  //     });
  // }
}


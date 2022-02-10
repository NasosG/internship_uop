import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class StudentsService {
  private students: Student[] = [];
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

  // addStudent(title: string, content: string) {
  //   const post: Student = { sn: title, givenname: content };
  //   this.http
  //     .post<{ message: string }>("http://localhost:3000/api/students", this.students)
  //     .subscribe(responseData => {
  //       console.log(responseData.message);
  //       this.students.push(post);
  //       // this.studentsUpdated.next([...this.students]);
  //     });
  // }
}


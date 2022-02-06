import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({providedIn: 'root'})
export class StudentsService {
  private students: Student[] = [];
  private studentsUpdated = new Subject<Student[]>();

  constructor(private http: HttpClient) {}

  getStudentUpdateListener() {
    return this.studentsUpdated.asObservable();
  }

  getStudents() {
    this.http
      .get<Student[]>('http://localhost:3000/api/students')
      .subscribe((postData) => {
        this.students = postData;
        console.log(postData);
        this.studentsUpdated.next([...this.students]);
      });
  }

  // getStudents() {
  //    this.http
  //     .get<Student[]>('http://localhost:3000/api/students')
  // }

}

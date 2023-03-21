import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import {Period} from 'src/app/department-managers/period.model';
import {Student} from '../student.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'student-contract',
  templateUrl: './student-contract.component.html',
  styleUrls: ['./student-contract.component.css']
})
export class StudentContractComponent implements OnInit {
  periodId!: number;
  studentsSSOData!: Student[];
  constructor(private studentsService: StudentsService, private authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents()
      .subscribe((students: Student[]) => {
        this.studentsSSOData = students;
        this.studentsService.getLatestPeriodOfStudent(this.studentsSSOData[0].department_id)
          .subscribe((periodMaxId: any) => {
            this.periodId = periodMaxId;
          })
      });
  }

  receiveFile(studentId: number, docType: string) {
    this.studentsService.receiveFile(studentId, docType).subscribe(res => {
      window.open(window.URL.createObjectURL(res));
    });
  }

  downloadContractFileForStudent() {
    let studentId: number = this.authService.getSessionId();
    this.studentsService.receiveContractFile(studentId, this.periodId, this.studentsSSOData[0]?.department_id, "docx")
      .subscribe(res => {
        window.open(window.URL.createObjectURL(res));
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { StudentsService } from 'src/app/students/student.service';
import { Department } from 'src/app/students/department.model';

@Component({
  selector: 'app-students-sheet-reminder',
  templateUrl: './students-sheet-reminder.component.html',
  styleUrls: ['./students-sheet-reminder.component.css']
})
export class StudentsSheetReminderComponent implements OnInit {
  departments!: Department[];
  sheetType: 'entry' | 'exit' = 'entry';
  departmentId: number = 0;
  students: any = [];
  searched = false;

  constructor(private adminService: AdminService, public studentsService: StudentsService) {}
  
  ngOnInit() {
    this.studentsService.getAtlasInstitutions()
      .subscribe((fetchedDepartments: Department[]) => {
        this.departments = fetchedDepartments;
      });
   }

  async fetchStudents() {
    this.searched = false;
    try {
      this.students = await this.adminService.getStudentsWithoutSheets(this.departmentId, this.sheetType);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      this.searched = true;
    }
  }

  onInputChange() {
    this.students = [];
    this.searched = false;
  }

  sendReminderEmails() {
    const studentMails = this.students.map((s: any) => s.email);

    this.adminService.sendSheetReminderEmails(this.departmentId, this.sheetType, studentMails)
      .subscribe({
        next: () => {
          alert('Εστάλησαν οι υπενθυμίσεις.');
        },
        error: (err) => {
          console.error('Error sending reminders:', err);
          alert('Πρόβλημα κατά την αποστολή των email.');
        }
      });
  }

}

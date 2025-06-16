import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-students-sheet-reminder',
  templateUrl: './students-sheet-reminder.component.html',
  styleUrls: ['./students-sheet-reminder.component.css']
})
export class StudentsSheetReminderComponent implements OnInit {

 sheetType: 'entry' | 'exit' = 'entry';
  departmentId: number = 0;
  students: any = [];
  searched = false;

  constructor(private adminService: AdminService) {}
  
  ngOnInit() {}

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

  async sendReminderEmails() {
    try {
      await this.adminService.sendSheetReminderEmails(this.departmentId, this.sheetType);
      alert('Εστάλησαν οι υπενθυμίσεις.');
    } catch (error) {
      console.error('Error sending reminders:', error);
      alert('Πρόβλημα κατά την αποστολή των email.');
    }
  }

}

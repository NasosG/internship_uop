import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import {AuthService} from 'src/app/auth/auth.service';
import Swal from 'sweetalert2';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-sheet-input',
  templateUrl: './sheet-input.component.html',
  styleUrls: ['./sheet-input.component.css']
})
export class SheetInputComponent implements OnInit {

  private studentSubscription!: Subscription;
  public isEditEnabled = true;
  @ViewChild('tabGroup') tabGroup: any | undefined;
  studentsData: any;
  studentName!: string;

  constructor(public studentsService: StudentsService, public authService: AuthService) { }

  ngOnInit(): void {
    this.studentsService.getStudents().subscribe(students => {
      this.studentsData = students;
    });
    // this.studentsData = [...this.studentsService.students];
  }

  printInputSheet() {
    let currentDate = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
    const printContent = document.getElementById("entrySheetPreviewContent");
    this.studentsData = [...this.studentsService.students];
    this.studentName = this.studentsData[0].givenname + " " + this.studentsData[0].sn;
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
    windowPrint?.document.write("<br><br><br><br><br><h3 style='text-align: right;'>Υπογραφή</h3>");
    windowPrint?.document.write("<h5 style='text-align: right;'>" + currentDate + "</h5><br><br><br>");
    windowPrint?.document.write("<h5 style='text-align: right;'>" + this.studentName + "</h5>");
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

  onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

  public onSaveInputSheetSwal(formData: FormData) {
    Swal.fire({
      title: 'Δημιουργία δελτίου εισόδου',
      text: 'Είστε σίγουροι ότι θέλετε να καταχωρήσετε το δελτίο εισόδου; Αυτή η ενέργεια είναι μη αναστρέψιμη.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentsService.insertStudentEntrySheet(formData);
        Swal.fire({
          title: 'Επιτυχής καταχώρηση',
          text: 'Πηγαίνετε στη καρτέλα "Προβολή" για να δείτε και να εκτυπώσετε το προς υπογραφή δελτίο σας.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then(() => { /* not the best technique */ location.reload() });
      }
    });
  }

}

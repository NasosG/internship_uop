import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { EntryForm } from '../entry-form.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-sheet-input',
  templateUrl: './sheet-input.component.html',
  styleUrls: ['./sheet-input.component.css']
})
export class SheetInputComponent implements OnInit {

  private studentSubscription!: Subscription;
  public selectedIndex = 0;

  @ViewChild('tabGroup') tabGroup: any | undefined;

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void { }

  printInputSheet() {
    const printContent = document.getElementById("inputSheetPreview");
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
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
        });
      }

    });
  }

}

import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import { StudentsService } from '../student.service';
import Swal from 'sweetalert2';
import { SheetInputComponent } from '../sheet-input/sheet-input.component';
import { EntryForm } from '../entry-form.model';

@Component({
  selector: 'app-sheet-input-preview',
  templateUrl: './sheet-input-preview.component.html',
  styleUrls: ['./sheet-input-preview.component.css']
})
export class SheetInputPreviewComponent extends SheetInputComponent implements OnInit {

  public entryForms: EntryForm[] = [];

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entryForms = forms;
        console.log(this.entryForms);
      });
  }

  public unemployedOption = [
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)', },
    { subCategory: 'A1.2', id: 'A1_2', name: 'A1_2', text: 'Είμαι 25 ετών και άνω και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ και διάστημα ανεργίας πάνω απο δώδεκα (12) συνεχείς μήνες ; (>12 μήνες)' },
    { subCategory: 'A1.3', id: 'A1_3', name: 'A1_3', text: 'Είμαι κάτω των 25 ετών και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας πάνω από έξι (6) συνεχείς μήνες; (>6 μήνες)' }
  ];

  public privateSecOptions = [
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.3', id: 'A2_3', name: 'A2_3', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.5', id: 'A2_5', name: 'A2_5', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.6', id: 'A2_6', name: 'A2_6', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }
  ];

  public publicSecOptions = [
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A3.3', id: 'A3_3', name: 'A3_3', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  override onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

}

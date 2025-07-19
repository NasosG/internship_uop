import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EvaluationForm } from '../evaluation-form.model';
import { SheetEvaluationComponent } from '../sheet-evaluation/sheet-evaluation.component';

@Component({
  selector: 'app-sheet-evaluation-edit',
  templateUrl: './sheet-evaluation-edit.component.html',
  styleUrls: ['./sheet-evaluation-edit.component.css']
})
export class SheetEvaluationEditComponent extends SheetEvaluationComponent implements OnInit {
  entries!: EvaluationForm[];
  
  @Input()
  override evaluation: any;
  
  override ngOnInit(): void {
    this.studentService.getStudentEvaluationSheets()
      .subscribe((forms: EvaluationForm[]) => {
        this.entries = forms;
      });
  }

  showSectionTitle(index: number, prefix: string): boolean {
    if (index === 0) {
      // First question show title
      return this.evaluation[index].question_name.startsWith(prefix);
    }
    // Display title if current question has prefix but the previous does not
    return this.evaluation[index].question_name.startsWith(prefix) &&
           !this.evaluation[index - 1].question_name.startsWith(prefix);
  }
  

  onSubmitStudentEvaluationSheet(formData: FormData) {
    console.log(formData);
    this.onSaveEvaluationSheetSwal(formData);
  }

  public onSaveEvaluationSheetSwal(formData: FormData) {
    Swal.fire({
      title: 'Αξιολόγηση πρακτικής άσκησης',
      text: 'Είστε σίγουροι ότι θέλετε να καταχωρήσετε την αξιολόγηση; Αυτή η ενέργεια είναι μη αναστρέψιμη.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.insertStudentEvaluationSheet(formData);
        Swal.fire({
          title: 'Επιτυχής καταχώρηση',
          text: 'Πηγαίνετε στη καρτέλα "Προβολή" για να δείτε και να εκτυπώσετε την αξιολόγηση σας.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then(() => { /* not the best technique */ location.reload(); });
      }
    });
  }

}

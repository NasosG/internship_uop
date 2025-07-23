import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EvaluationForm } from '../evaluation-form.model';
import { SheetEvaluationComponent } from '../sheet-evaluation/sheet-evaluation.component';
import { Utils } from 'src/app/MiscUtils';

@Component({
  selector: 'app-sheet-evaluation-edit',
  templateUrl: './sheet-evaluation-edit.component.html',
  styleUrls: ['./sheet-evaluation-edit.component.css']
})
export class SheetEvaluationEditComponent extends SheetEvaluationComponent implements OnInit {
  entries!: EvaluationForm[];
  
  @Input()
  override evaluation: any;

  extractTextBeforeList(html: string): string {
    const match = html.match(/^[\s\S]*?(?=<ul>)/);
    return match ? match[0].trim().replace('<br>', '') : '';
  }

  extractListItems(html: string): string[] {
    const ulMatch = html.match(/<ul>([\s\S]*?)<\/ul>/);
    if (!ulMatch) return [];

    const liMatches = ulMatch[1].match(/<li>(.*?)<\/li>/g) || [];
    return liMatches.map(li => li.replace(/<\/?li>/g, '').trim());
  }
  
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
    const finalAnswers: { [key: string]: string } = {};
    
    const answers = Utils.mapFormDataToAnswers(formData, 'question_id', 'answer');
    for (const { question_id, answer } of answers) {
      const groupKey = (question_id.startsWith('B1') || question_id.startsWith('C2')) ? question_id.split('_')[0] : question_id;
      const label = question_id.substring(groupKey.length + 1);

      if (!answer || answer === 'false') continue;

      if (!finalAnswers[groupKey]) {
        finalAnswers[groupKey] = '';
      }

      // Special logic for B1 and C2
      if ((groupKey === 'B1' || groupKey === 'C2') && answer && answer !== 'false') {
        const safeLabel = label?.trim() || '';

        if (!finalAnswers[groupKey]) {
          finalAnswers[groupKey] = safeLabel;
        } else {
          finalAnswers[groupKey] += ', ' + safeLabel;
        }
      }
      // For all others: store raw answer(s)
      else if (groupKey !== 'B1' && groupKey !== 'C2') {
        // Push answer as-is (can be array or string)
        finalAnswers[groupKey] = answer;
      }
    }

    const requiredGroups = ['B1', 'C2'];
    for (const group of requiredGroups) {
      if (!finalAnswers[group] || finalAnswers[group].length === 0) {
        alert(`Το πεδίο ${group} είναι υποχρεωτικό`);
        return;
      }
    }

    console.log('Final grouped answers:', finalAnswers);
    this.onSaveEvaluationSheetSwal(formData, finalAnswers);
  }

  public onSaveEvaluationSheetSwal(form: FormData, finalAnswers: any) {
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
        this.studentService.insertStudentEvaluationSheet(form, finalAnswers);
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

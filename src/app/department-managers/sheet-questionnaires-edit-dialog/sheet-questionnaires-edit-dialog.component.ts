import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Utils } from 'src/app/MiscUtils';
import { ExitForm } from 'src/app/students/exit-form.model';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';
import { EvaluationForm } from 'src/app/students/evaluation-form.model';
import { StudentsService } from 'src/app/students/student.service';
import { forkJoin, Subscription } from 'rxjs';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-sheet-questionnaires-edit-dialog',
  templateUrl: './sheet-questionnaires-edit-dialog.component.html',
  styleUrls: ['./sheet-questionnaires-edit-dialog.component.css']
})
export class SheetQuestionnairesEditDialogComponent implements OnInit {
  public exitForms: ExitForm[] = [];

  entries!: any;

  public currentDate: string = new Date().toJSON().slice(0, 10).split('-').reverse().join('/');
  private studentSubscription!: Subscription;
  answersMap: { [questionName: string]: any } = {};
  public formId?: string;
  public targetStudent?: any;
  public isEditEnabled: boolean = true;
  studentsData: any;    
  public evaluation: any;
  index: any;

  constructor(
    public dialogRef: MatDialogRef<SheetQuestionnairesEditDialogComponent>,
    public dialog: MatDialog,
    public departmentManagerService: DepManagerService,
    public studentService: StudentsService,
    @Inject(MAT_DIALOG_DATA) public data: { studentsData: any[], index: number },
  ) { }

  ngOnInit(): void {
    this.studentsData = this.data.studentsData;
    this.index = this.data.index;
  
    this.targetStudent = this.studentsData[this.index]??null;
  
    this.studentSubscription = forkJoin({
      evaluation: this.studentService.getEvaluationQuestions(),
      evaluationSheets: this.studentService.getLastEvaluationFormWithAnswersByStudentId(this.targetStudent?.uuid || '')
    }).subscribe(({ evaluation, evaluationSheets }) => {
      this.evaluation = evaluation;
      this.entries = evaluationSheets;

      this.formId = this.entries[0].form_id;
      this.currentDate = new Date().toLocaleDateString();
  
      this.answersMap = {};
  
      this.evaluation.forEach((question: any) => {

        const questionName = question.question_name;       
        const matchingAnswer = this.entries.find((entry: any) => entry.question_id == questionName);

        if (matchingAnswer) {
          if (question.question_type === 'SMALLINT') {
            this.answersMap[questionName] = Number(matchingAnswer.answer_smallint); // convert to number
          } else if (question.question_type === 'TEXT') {
            if (questionName.startsWith('B1') || questionName.startsWith('C2')) {
              // handle multiple checkbox case (assumed comma-separated string)
              this.answersMap[questionName] = matchingAnswer.answer_text?.split(',').map((s: any) => s.trim()) || [];
            } else {
              this.answersMap[questionName] = matchingAnswer.answer_text;
            }
          }
        }
      });
  
      console.log('answersMap:', this.answersMap);
    });
  }
  

  onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

  onSaveInputSheetSwal(formData: FormData) {
    Swal.fire({
      title: 'Είστε σίγουρος/η;',
      text: 'Θα αποθηκευτεί το φύλλο εισαγωγής στο σύστημα',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, αποθήκευση!',
      cancelButtonText: 'Άκυρο'
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  extractTextBeforeList(html: string): string {
    const match = html.match(/^[\s\S]*?(?=<ul>)/);
    return match ? match[0].trim() : '';
  }

  extractListItems(html: string): string[] {
    const ulMatch = html.match(/<ul>([\s\S]*?)<\/ul>/);
    if (!ulMatch) return [];

    const liMatches = ulMatch[1].match(/<li>(.*?)<\/li>/g) || [];
    return liMatches.map(li => li.replace(/<\/?li>/g, '').trim());
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

    console.log('Final grouped answers:', finalAnswers);
    this.onSaveEvaluationSheetSwal(formData, finalAnswers);
  }

  public onSaveEvaluationSheetSwal(form: FormData, finalAnswers: any) {
    Swal.fire({
      title: 'Υποβολή Ερωτηματολογίου',
      text: 'Είστε σίγουροι ότι θέλετε να καταχωρήσετε το ερωτηματολόγιο;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentService.updateStudentEvaluationSheet(form, finalAnswers, this.formId, this.targetStudent?.uuid || '');
        Swal.fire({
          title: 'Επιτυχής καταχώρηση',
          text: 'Πηγαίνετε στη καρτέλα "Προβολή" για να δείτε και να εκτυπώσετε το ερωτηματολόγιό σας.',
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

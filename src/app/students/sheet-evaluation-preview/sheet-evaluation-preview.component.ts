import { Component, OnInit } from '@angular/core';
import { EvaluationForm } from '../evaluation-form.model';
import { SheetEvaluationComponent } from '../sheet-evaluation/sheet-evaluation.component';

@Component({
  selector: 'app-sheet-evaluation-preview',
  templateUrl: './sheet-evaluation-preview.component.html',
  styleUrls: ['./sheet-evaluation-preview.component.css']
})
export class SheetEvaluationPreviewComponent extends SheetEvaluationComponent implements OnInit {

  public evaluationForms: EvaluationForm[] = [];

  override ngOnInit(): void {
    this.studentService.getStudentEvaluationSheets()
      .subscribe((forms: EvaluationForm[]) => {
        this.evaluationForms = forms;
        console.log(this.evaluationForms);
      });
  }

}

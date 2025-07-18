import { Component, OnInit, Output } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { EvaluationForm } from '../evaluation-form.model';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-sheet-evaluation',
  templateUrl: './sheet-evaluation.component.html',
  styleUrls: ['./sheet-evaluation.component.css']
})
export class SheetEvaluationComponent implements OnInit {
  private studentSubscription!: Subscription;

  public isEditEnabled: boolean = true;
  studentsData: any;
  studentName!: string;
  currentDate: string = '';
  @Output()
public evaluation:any;
  constructor(public studentService: StudentsService) { }

ngOnInit(): void {
  this.currentDate = new Date().toLocaleDateString();

  this.studentSubscription = forkJoin({
    students: this.studentService.getStudents(),
    evaluation: this.studentService.getEvaluationQuestions()
  }).subscribe(({ students, evaluation }) => {
    this.studentsData = students;
    this.evaluation = evaluation;

    if (this.studentsData.length > 0) {
      this.studentName = `${this.studentsData[0].givenname} ${this.studentsData[0].sn}`;
    }

    console.log(this.evaluation);
  });
}

  // public evaluation = [
  //   { subCategory: '1', id: 'q1', name: 'q1', text: 'Πώς αξιολογείτε τις γνώσεις θεωρίας που έχετε αποκτήσει συγκριτικά με τις δραστηριότητες που πραγματοποιήσατε;' },
  //   { subCategory: '2', id: 'q2', name: 'q2', text: 'Πώς αξιολογείτε τις γνώσεις πρακτικής που έχετε αποκτήσει συγκριτικά με τις δραστηριότητες που πραγματοποιήσατε;' },
  //   { subCategory: '3', id: 'q3', name: 'q3', text: 'Σε τι βαθμό ανταποκρίθηκε η πρακτική εργασία στις προσδοκίες που είχατε από αυτή;' },
  //   { subCategory: '4', id: 'q4', name: 'q4', text: 'Πόσο πρόθυμοι ήταν οι εργαζόμενοι του φορέα να υποστηρίξουν την πρακτική σας άσκηση;' },
  //   { subCategory: '5', id: 'q5', name: 'q5', text: 'Θεωρείτε ότι η διάρκεια της πρακτικής άσκησης ήταν αρκετή για να μπορέσετε να αποκτήσετε χρήσιμες εμπειρίες και γνώσεις;' },
  //   { subCategory: '6', id: 'q6', name: 'q6', text: 'Θεωρείτε ότι η περίοδος που κάνατε την πρακτική άσκηση ήταν κατάλληλη για να αποκτήσετε χρήσιμες εμπειρίες και γνώσεις;' },
  //   { subCategory: '7', id: 'q7', name: 'q7', text: 'Θεωρείτε ότι ο συγκεκριμένος φορέας είναι κατάλληλος ώστε να πραγματοποιούν πρακτική άσκηση συνάδελφοί σας στο μέλλον;' },
  // ];

  public evaluationText = [
    { subCategory: '8', id: 'q8', name: 'q8', text: 'Σε ποιες δραστηριότητες του φορέα είχατε συμμετοχή;' },
    { subCategory: '9', id: 'q9', name: 'q9', text: 'Προσδιορίστε την περίοδο (τις περιόδους) που θεωρείτε ότι είναι οι πιο κατάλληλες για τη συγκεκριμένη πρακτική άσκηση' },
    { subCategory: '10', id: 'q10', name: 'q10', text: 'Ποια θεωρείτε ότι είναι η κατάλληλη διάρκεια για τη συγκεκριμένη πρακτική άσκηση στο συγκεκριμένο φορέα' },
    { subCategory: '11', id: 'comments', name: 'comments', text: 'Γενικά Σχόλια' },
  ];

  printEvaluationSheet(): void {
    const printContent = document.getElementById('evaluationSheetPreviewContent');
    // if (!printContent) return;

    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');

    // windowPrint?.document.write(printContent.innerHTML);
    windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
    windowPrint?.document.write('<br><br><br><br><br><h3 style="text-align: right;">Υπογραφή</h3>');
    windowPrint?.document.write(`<h5 style="text-align: right;">${this.currentDate}</h5><br><br><br>`);
    windowPrint?.document.write(`<h5 style="text-align: right;">${this.studentName}</h5>`);
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

  ngOnDestroy(): void {
    if (this.studentSubscription) {
      this.studentSubscription.unsubscribe();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { StudentsService } from '../student.service';

@Component({
  selector: 'app-sheet-evaluation',
  templateUrl: './sheet-evaluation.component.html',
  styleUrls: ['./sheet-evaluation.component.css']
})
export class SheetEvaluationComponent implements OnInit {

  constructor(public studentService: StudentsService) { }

  ngOnInit(): void {
  }

  public evaluation = [
    { subCategory: '1', id: 'q1', name: 'q1', text: 'Πώς αξιολογείτε τις γνώσεις θεωρίας που έχετε αποκτήσει συγκριτικά με τις δραστηριότητες που πραγματοποιήσατε;' },
    { subCategory: '2', id: 'q2', name: 'q2', text: 'Πώς αξιολογείτε τις γνώσεις πρακτικής που έχετε αποκτήσει συγκριτικά με τις δραστηριότητες που πραγματοποιήσατε;' },
    { subCategory: '3', id: 'q3', name: 'q3', text: 'Σε τι βαθμό ανταποκρίθηκε η πρακτική εργασία στις προσδοκίες που είχατε από αυτή;' },
    { subCategory: '4', id: 'q4', name: 'q4', text: 'Πόσο πρόθυμοι ήταν οι εργαζόμενοι του φορέα να υποστηρίξουν την πρακτική σας άσκηση;' },
    { subCategory: '5', id: 'q5', name: 'q5', text: 'Θεωρείτε ότι η διάρκεια της πρακτικής άσκησης ήταν αρκετή για να μπορέσετε να αποκτήσετε χρήσιμες εμπειρίες και γνώσεις;' },
    { subCategory: '6', id: 'q6', name: 'q6', text: 'Θεωρείτε ότι η περίοδος που κάνατε την πρακτική άσκηση ήταν κατάλληλη για να αποκτήσετε χρήσιμες εμπειρίες και γνώσεις;' },
    { subCategory: '7', id: 'q7', name: 'q7', text: 'Θεωρείτε ότι ο συγκεκριμένος φορέας είναι κατάλληλος ώστε να πραγματοποιούν πρακτική άσκηση συνάδελφοί σας στο μέλλον;' },
  ];

  public evaluationText = [
    { subCategory: '8', id: 'q8', name: 'q8', text: 'Σε ποιες δραστηριότητες του φορέα είχατε συμμετοχή;' },
    { subCategory: '9', id: 'q9', name: 'q9', text: 'Προσδιορίστε την περίοδο (τις περιόδους) που θεωρείτε ότι είναι οι πιο κατάλληλες για τη συγκεκριμένη πρακτική άσκηση' },
    { subCategory: '10', id: 'q10', name: 'q10', text: 'Ποια θεωρείτε ότι είναι η κατάλληλη διάρκεια για τη συγκεκριμένη πρακτική άσκηση στο συγκεκριμένο φορέα' },
    { subCategory: '11', id: 'comments', name: 'comments', text: 'Γενικά Σχόλια' },

  ];
}

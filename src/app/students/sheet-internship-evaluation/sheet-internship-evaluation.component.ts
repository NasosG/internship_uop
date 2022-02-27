import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sheet-internship-evaluation',
  templateUrl: './sheet-internship-evaluation.component.html',
  styleUrls: ['./sheet-internship-evaluation.component.css']
})
export class SheetInternshipEvaluationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public unemployedOption = [
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)' },
    { subCategory: 'A1.2', id: 'A1_2', name: 'A1_2', text: 'Είμαι 25 ετών και άνω και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ και διάστημα ανεργίας πάνω απο δώδεκα (12) συνεχείς μήνες ; (>12 μήνες)' },
    { subCategory: 'A1.3', id: 'A1_3', name: 'A1_3', text: 'Είμαι κάτω των 25 ετών και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας πάνω από έξι (6) συνεχείς μήνες; (>6 μήνες)' }
  ];

}

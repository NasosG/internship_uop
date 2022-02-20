import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sheet-input-preview',
  templateUrl: './sheet-input-preview.component.html',
  styleUrls: ['./sheet-input-preview.component.css']
})
export class SheetInputPreviewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  public unemployedOption = [
    { subCategory: 'A1.1', id: 'option1', name: 'option1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)' },
    { subCategory: 'A1.2', id: 'option2', name: 'option2', text: 'Είμαι 25 ετών και άνω και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ και διάστημα ανεργίας πάνω απο δώδεκα (12) συνεχείς μήνες ; (>12 μήνες)' },
    { subCategory: 'A1.3', id: 'option3', name: 'option3', text: 'Είμαι κάτω των 25 ετών και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας πάνω από έξι (6) συνεχείς μήνες; (>6 μήνες)' }

  ];

  public privateSecOptions = [
    { subCategory: 'A2.1', id: 'option4', name: 'option4', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.2', id: 'option5', name: 'option5', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.3', id: 'option6', name: 'option6', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.4', id: 'option7', name: 'option7', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.5', id: 'option8', name: 'option8', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.6', id: 'option9', name: 'option9', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }

  ];

  public publicSecOptions = [
    { subCategory: 'A3.1', id: 'option10', name: 'option10', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A3.2', id: 'option11', name: 'option11', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A3.3', id: 'option12', name: 'option12', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' },

  ];


}

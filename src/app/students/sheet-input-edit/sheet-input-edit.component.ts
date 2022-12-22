import { Component, OnInit } from '@angular/core';
import {EntryForm} from '../entry-form.model';
import {SheetInputComponent} from '../sheet-input/sheet-input.component';

@Component({
  selector: 'app-sheet-input-edit',
  templateUrl: './sheet-input-edit.component.html',
  styleUrls: ['./sheet-input-edit.component.css']
})
export class SheetInputEditComponent extends SheetInputComponent implements OnInit {
  entries!: EntryForm[];

  override ngOnInit(): void {
    this.studentsService.getStudentEntrySheets()
      .subscribe((forms: EntryForm[]) => {
        this.entries = forms;
      });
  }

  public unemployedOption = [
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)', },
    { subCategory: 'A1.2', id: 'A1_2', name: 'A1_2', text: 'Είμαι 25 ετών και άνω και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ και διάστημα ανεργίας πάνω απο δώδεκα (12) συνεχείς μήνες ; (>12 μήνες)' },
    { subCategory: 'A1.3', id: 'A1_3', name: 'A1_3', text: 'Είμαι κάτω των 25 ετών και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας πάνω από έξι (6) συνεχείς μήνες; (>6 μήνες)' }
  ];

  public privateSecOptions = [
    { subCategory: 'A2.0', id: 'A2_0', name: 'A2_0', text: 'Εργαζόμενος' },
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Απασχολούμενος/νη στον ιδιωτικό τομέα' },
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.3', id: 'A2_3', name: 'A2_3', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.5', id: 'A2_5', name: 'A2_5', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.6', id: 'A2_6', name: 'A2_6', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.7', id: 'A2_7', name: 'A2_7', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }
  ];

  public publicSecOptions = [
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Απασχολούμενος/νη στο Δημόσιο Τομέα (ΝΠΔΔ και ΝΠΙΔ)' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A3.3', id: 'A3_3', name: 'A3_3', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A3.4', id: 'A3_4', name: 'A3_4', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  // A4.1 option can be found on the html

  public jobRelationOtherThanAbove = [
    { subCategory: 'A5.1', id: 'A5_1', name: 'A5_1', text: 'Σχέση εργασίας (άλλη) που δεν εμπίπτει σε καμία απο τις παραπάνω κατηγορίες' }
  ]

  public specialJobOptions = [
    { subCategory: 'A6.1', id: 'A6_1', name: 'A6_1', text: 'Δεν ανήκω σε καμία από τις παραπάνω κατηγορίες (Δεν είμαι ούτε εγγεγραμένος/η άνεργος/η στον ΟΑΕΔ ούτε εργαζόμενος/η - αυτοαπασχολούμενος/η )' },
    { subCategory: 'A6.2', id: 'A6_2', name: 'A6_2', text: 'Δεν είμαι εγγεγραμμένος στον ΟΑΕΔ ούτε εργάζομαι αλλά αναζητώ εργασία' },
    { subCategory: 'A6.3', id: 'A6_3', name: 'A6_3', text: 'Είμαι 25 ετών και άνω και πριν την είσοδό μου στο πρόγραμμα αναζητούσα εργασία για πάνω από 12 μήνες' },
    { subCategory: 'A6.4', id: 'A6_4', name: 'A6_4', text: 'Είμαι κάτω των 25 ετών πριν την είσοδό μου στο πρόγραμμα αναζητούσα εργασία για πάνω από 6 μήνες' },
    { subCategory: 'A6.5', id: 'A6_5', name: 'A6_5', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμμένος άνεργος, δεν αναζητώ εργασία' }
  ];

  public educationOptions = [
    { subCategory: 'B1.1', id: 'B1_1', name: 'B1_1', text: 'Συμμετέχετε σε κάποιο άλλο πρόγραμμα κατάρτισης ή εκπαίδευσης ή διά βίου μάθησης, επιδοτούμενο ή μη;' },
    { subCategory: 'B1.2', id: 'B1_2', name: 'B1_2', text: 'Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B1.3', id: 'B1_3', name: 'B1_3', text: 'Μαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (Δημοτικό, Γυμνάσιο, Λύκειο. Συμπεριλαμβάνονται και τα Σχολεία Δεύτερης Ευκαιρίας)' },
    { subCategory: 'B1.4', id: 'B1_4', name: 'B1_4', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης ή σε ΙΕΚ ή σε Κολλέγιο ή σε Σχολές που εποπτεύονται από άλλα Υπουργεία εκτός του Υπουργείου Παιδείας, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'B1.5', id: 'B1_5', name: 'B1_5', text: 'Συμμετέχων/ουσα σε κάποιο πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης (π.χ. ΚΕΚ)' },
    { subCategory: 'B1.6', id: 'B1_6', name: 'B1_6', text: 'Συμμετέχων/ουσα σε πρόγραμμα πρακτικής άσκησης με αμοιβή (ως φοιτητής τριτοβάθμιας εκπαίδευση, σπουδαστής ΙΕΚ, τουριστικών σχολών, Ακαδημίας Εμπορικού Ναυτικού, κτλ)' },
    { subCategory: 'B1.7', id: 'B1_7', name: 'B1_7', text: 'Μεταπτυχιακός/ή Φοιτητής/τρια ή υποψήφιος/α Διδάκτωρ' }
  ];

  public educationalStandardOptions = [
    { subCategory: 'B2.1', id: 'B2_1', name: 'B2_1', text: 'Δεν έχω αποφοιτήσει από το δημοτικό' },
    { subCategory: 'B2.2', id: 'B2_2', name: 'B2_2', text: 'Απόφοιτος δημοτικού' },
    { subCategory: 'B2.3', id: 'B2_3', name: 'B2_3', text: 'Απόφοιτος γυμνασίου' },
    { subCategory: 'B2.4', id: 'B2_4', name: 'B2_4', text: 'Απόφοιτος λυκείου' },
    { subCategory: 'B2.5', id: 'B2_5', name: 'B2_5', text: 'Απόφοιτος ΙΕΚ, ή ιδιωτικού κολλεγίου, ή σχολών που εποπτεύονται από άλλα Υπουργείοα' },
    { subCategory: 'B2.6', id: 'B2_6', name: 'B2_6', text: 'Απόφοιτος ΑΕΙ/ΤΕΙ' },
    { subCategory: 'B2.7', id: 'B2_7', name: 'B2_7', text: 'Κάτοχος μεταπτυχιακού διπλώματος' },
    { subCategory: 'B2.8', id: 'B2_8', name: 'B2_8', text: 'Κάτοχος διδακτορικού διπλώματος' }
  ];

  public demographicsOptions = [
    { subCategory: 'C1.1', id: 'C1_1', name: 'C1_1', text: 'Έχει γεννηθεί ένας ή και οι δύο γονείς σας στο εξωτερικό (σε οποιαδήποτε χώρα, εντός ή εκτός της ΕΕ).;' },
    { subCategory: 'C1.2', id: 'C1_2', name: 'C1_2', text: 'Μουσουλμανική Μειονότητα της Θράκης' },
    { subCategory: 'C1.3', id: 'C1_3', name: 'C1_3', text: 'Ρομά' },
    { subCategory: 'C1.4', id: 'C1_4', name: 'C1_4', text: 'Mετανάστες' },
    { subCategory: 'C1.5', id: 'C1_5', name: 'C1_5', text: 'Πρόσφυγες / Δικαιούχοι επικουρικής προστασίας/αιτούντες άσυλο ή αιτούντες διεθνή προστασία' },
    { subCategory: 'C1.6', id: 'C1_6', name: 'C1_6', text: 'Άτομα με Αναπηρία με πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.)' },
    { subCategory: 'C1.7', id: 'C1_7', name: 'C1_7', text: 'Άτομα με Αναπηρία χωρίς πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.)' },
    { subCategory: 'C1.8', id: 'C1_8', name: 'C1_8', text: 'Aπεξαρτημένα άτομα / άτομα υπό απεξάρτηση' },
    { subCategory: 'C1.9', id: 'C1_9', name: 'C1_9', text: 'Φυλακισμένοι/Αποφυλακισμένοι'},
    { subCategory: 'C1.10', id: 'C1_10', name: 'C1_10', text: 'Άστεγοι ή άτομα που έχουν αποκλειστεί από τη στέγαση' },
    { subCategory: 'C1.11', id: 'C1_11', name: 'C1_11', text: 'Δικαιούχοι Ελάχιστου Εγγυημένου Εισοδήματος' }
  ];

  // override onSubmitStudentEntrySheet(formData: FormData) {
  //   // this.router.navigate(["/app-sheet-input-preview"]);
  //   this.onSaveInputSheetSwal(formData);
  // }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';
import Swal from 'sweetalert2';
import {StudentsService} from '../student.service';

@Component({
  selector: 'app-sheet-output',
  templateUrl: './sheet-output.component.html',
  styleUrls: ['./sheet-output.component.css']
})
export class SheetOutputComponent implements OnInit {

  private studentSubscription!: Subscription;
  public isEditEnabled = true;
  @ViewChild('tabGroup') tabGroup: any | undefined;
  studentsData: any;
  studentName!: string;

  constructor(public studentsService: StudentsService) { }

  ngOnInit(): void { }

  printOutputSheet() {
    let currentDate = new Date().toJSON().slice(0,10).split('-').reverse().join('/');
    const printContent = document.getElementById("entrySheetPreviewContent");
    this.studentsData = [...this.studentsService.students];
    this.studentName = this.studentsData[0].givenname + " " + this.studentsData[0].sn;
    const windowPrint = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    windowPrint?.document.write((printContent?.innerHTML == null) ? '' : printContent?.innerHTML);
    windowPrint?.document.write("<br><br><br><br><br><h3 style='text-align: right;'>Υπογραφή</h3>");
    windowPrint?.document.write("<h5 style='text-align: right;'>"+ currentDate +"</h5><br><br><br>");
    windowPrint?.document.write("<h5 style='text-align: right;'>"+ this.studentName + "</h5>");
    windowPrint?.document.close();
    windowPrint?.focus();
    windowPrint?.print();
    windowPrint?.close();
  }

  onSubmitStudentEntrySheet(formData: FormData) {
    this.onSaveInputSheetSwal(formData);
  }

  public onSaveInputSheetSwal(formData: FormData) {
    Swal.fire({
      title: 'Δημιουργία δελτίου εισόδου',
      text: 'Είστε σίγουροι ότι θέλετε να καταχωρήσετε το δελτίο εισόδου; Αυτή η ενέργεια είναι μη αναστρέψιμη.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.studentsService.insertStudentExitSheet(formData);
        Swal.fire({
          title: 'Επιτυχής καταχώρηση',
          text: 'Πηγαίνετε στη καρτέλα "Προβολή" για να δείτε και να εκτυπώσετε το προς υπογραφή δελτίο σας.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then( () => { /* not the best technique */ location.reload(); } );
      }
    });
  }

   public unemployedOption = [
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)' },
  ];

  public privateSecOptions = [
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Είμαι εργαζόμενος/νη ή αυτοαπασχολούμενος/η' },
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Αν έχετε απαντήσει ΝΑΙ στην ερώτηση Α2, η θέση απασχόλησης που κατέχετε συγχρηματοδοτείται στο πλαίσιο προγράμματος του ΕΣΠΑ;' },
    { subCategory: 'A2.3', id: 'A2_3', name: 'A2_3', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.5', id: 'A2_5', name: 'A2_5', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.6', id: 'A2_6', name: 'A2_6', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.7', id: 'A2_7', name: 'A2_7', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.8', id: 'A2_8', name: 'A2_8', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }
  ];

  public publicSecOptions = [
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A3.3', id: 'A3_3', name: 'A3_3', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  public noCategoryOptions = [
    { subCategory: 'A6.1', id: 'A6_1', name: 'A6_1', text: 'Δεν ανήκω σε κάμια απο τις παραπάνω κατηγορίες (Δεν είμαι ούτε εγγεγραμένος/η άνεργος/η στον ΟΑΕΔ ούτε εργαζόμενος/η - αυτοαπασχολούμενος/η )' },
    { subCategory: 'A6.2', id: 'A6_2', name: 'A6_2', text: 'Δεν είμαι εγγεγραμένος/νη στον ΟΑΕΔ, ούτε εργάζομαι, αλλά αναζητώ εργασία και είμαι άμεσα διαθέσιμος να εργαστώ' },
    { subCategory: 'A6.3', id: 'A6_3', name: 'A6_3', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμένος άνεργος, δεν αναζητώ εργασία )' }
  ];

  public educationStatusOptions = [
    { subCategory: 'B1.1', id: 'B1_1', name: 'B1_1', text: 'Συμμετέχετε σε κάποιο άλλο πρόγραμμα κατάρτισης ή εκπαίδευσης ή δια βίου μάθησης, επιδοτούμενο ή μη; Αν ναι, σημειώστε σε ποια αποό τις παρακάτω κατηγορίες ανήκετε: Επεξήγηση 1: Η ερώτηση αφορά τη συμμετοχή σας σε κάποιο άλλο πρόγραμμα εκπαίδευσης ή κατάρτισης ή δια βίου μάθησης τη χρονική στιγμή πριν την είσοδο σας σε αυτήν την πράξη του ΕΚΤ).Επεξήγηση 2: Η συμμετοχή σε πρόγραμμα κατάρτισης ή εκπαίδευσης ή δια βίου μάθησης εννοεί μαθητές όλων των εκπαιδευτικών βαθμίδων, συμπεριλαμβανόμενων των συμμετεχόντων σε Σχολεία Δεύτερης ευκαιρίας, Γενικά και Επαγγελματικά Λύκεια, σπουδαστές σε Σχολές Επαγγελματικής Κατάρτισης που παρέχουν αρχική επαγγελματική κατάρτιση σε αποφοίτους της υποχρεωτικής τυπικής εκπαίδευσης, σπουδαστές και πρακτικά ασκούμενους σε Ινστιτούτα Επαγγελματικής κατάρτισης, συμμετέχοντες σε προγράμματα Κέντρων Δια Βίου Μάθησης που παρέχουν συνεχιζόμενη επαγγελματική κατάρτιση, γενική εκπαίδευση ενηλίκων, επαγγελματικό προσανατολισμό και δια βίου συμβουλευτική, σπουδαστές Κολλεγίων, σπουδαστές και πρακτικά ασκούμενους Σχολών που εποπτεύονται από τα Υπουργεία Πολιτισμού, Ναυτιλίας, Τουρισμού κλπ, φοιτητές τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B1.2', id: 'B1_2', name: 'B1_2', text: 'Το πρόγραμμα εκαίδευσης ή κατάρτισης ή δια βίου μάθησης στο οποίο συμμετέχετε, συγχρηματοδοτείται στο πλαίσιο προγράμματος του ΕΣΠΑ; Επεξήγηση: Να απαντηθεί από όσους έχουν απαντήσει ΝΑΙ σε κάποιες από τις ερωτήσεις Β ' },
    { subCategory: 'B1.3', id: 'B1_3', name: 'B1_3', text: 'Μαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (Δημοτικό, Γυμνάσιο, Λύκειο. Συμπεριλαμβάνονται και τα Σχολεία Δεύτερης ευκαιρίας)' },
    { subCategory: 'B1.4', id: 'B1_4', name: 'B1_4', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης ή σε ΙΕΚ ή σε Κολλέγιο ή σε Σχολές που εποπτεύονται από άλλα υπουργεία εκτός του Υπουργείου Παιδείας, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ ' },
    { subCategory: 'B1.5', id: 'B1_5', name: 'B1_5', text: 'Συμμετέχων/ουσα σε κάποιο πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης (π.χ ΚΕΚ)' },
    { subCategory: 'B1.6', id: 'B1_6', name: 'B1_6', text: 'Είμαι Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B1.7', id: 'B1_7', name: 'B1_7', text: 'Συμμετέχω σε πρόγραμμα πρακτικής άσκησης με αμοιβή(ως φοιτητής τριτοβάθμιας εκπαίδευσης, σπουδαστής ΙΕΚ, τουριστικών σχολών, Ακαδιμίας Εμπορικού Ναυτικού κτλ)' },
    { subCategory: 'B1.8', id: 'B1_8', name: 'B1_8', text: 'Μεταπτυχιακός Φοιτητής/τρια ή υποψήφιος/ια Διδάκτωρ' }
  ];
}


import Swal from 'sweetalert2';

export abstract class Utils {

  public static onSaveSwal() {
    Swal.fire({
      title: 'Ενημέρωση στοιχείων',
      text: 'Τα στοιχεία σας ενημερώθηκαν επιτυχώς',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      // Reload the Page
      location.reload();
    });
  }

  public static reformatDateToEULocaleStr(date: Date): string {
    let newDate = new Date(date);
    return (newDate.getDate() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getFullYear());
  }

  public static getPreferredTimestamp(dateParam: any): string {
    let dateVal = new Date(dateParam);
    let preferredTimestamp = dateVal.getDay() + "/" + dateVal.getMonth() + "/" + dateVal.getFullYear() + " " + dateVal.getHours() + ":" + dateVal.getMinutes();
    return preferredTimestamp;
  }

  public static getAtlasPreferredTimestamp(dateParam: string|number|Date): string {
    let dateVal = new Date(dateParam);
    let preferredTimestamp = dateVal.toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    return preferredTimestamp;
  }

  public static reformatDateOfBirth(dateOfBirth: string) {
    let startDate = dateOfBirth;

    let year = startDate.substring(0, 4);
    let month = startDate.substring(4, 6);
    let day = startDate.substring(6, 8);

    let displayDate = day + '/' + month + '/' + year;
    return displayDate;
  }

  public static changeDateFormat(dateStr: any) {
    let dArr = dateStr.split("-");  // ex input "2010-01-18"
    return dArr[2] + "/" + dArr[1] + "/" + dArr[0].substring(2); //ex out: "18/01/10"
  }

  public static isLengthOutOfBounds(lengthMin: number, lengthMax: number): boolean {
    return (length > lengthMin && length > lengthMax);
  }

  public static isEmptyOrWhiteSpace(str: string) {
    return str === null || str.match(/^ *$/) !== null;
  }

  public static TaxNumRule(afm: string): boolean {
    if (Utils.isEmptyOrWhiteSpace(afm))
      return false;

    if (afm.length != 9)
      return false;

    let result = false;
    let count = 0;
    let digit, finalNum = 0;
    let temp;

    for (let i = afm.length; i >= 1; i--) {
      if (count != 0) {
        temp = afm[i - 1];
        digit = parseInt(temp);
        finalNum = finalNum + digit * Math.pow(2, count);
      }
      count++;
    }

    temp = afm[afm.length - 1];
    digit = parseInt(temp);

    if (((finalNum % 11) % 10) == digit)
      result = true;
    else
      result = false;

    return result;
  }

  public static getCurrentYear() {
    return new Date().getFullYear();
  }

  public static add3Dots(inputText: string, limit: number): string {
    let dots = "...";
    if (inputText.length > limit) {
      inputText = inputText.substring(0, limit) + dots;
    }

    return inputText;
  }

  public static getAEICodeFromDepartmentId(departmentId: number): number {
    return parseInt(departmentId.toString().substring(0, 4));
  }

  public static isTechTEIDepartment(departmentId: number): boolean {
    return departmentId.toString().length == 6;
  }

  //InputSheets
  public static unemployedOption = [
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)', },
    { subCategory: 'A1.2', id: 'A1_2', name: 'A1_2', text: 'Είμαι 25 ετών και άνω και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ και διάστημα ανεργίας πάνω απο δώδεκα (12) συνεχείς μήνες ; (>12 μήνες)' },
    { subCategory: 'A1.3', id: 'A1_3', name: 'A1_3', text: 'Είμαι κάτω των 25 ετών και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας πάνω από έξι (6) συνεχείς μήνες; (>6 μήνες)' }
  ];

  public static privateSecOptions = [
    { subCategory: 'A2.0', id: 'A2_0', name: 'A2_0', text: 'Εργαζόμενος' },
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Απασχολούμενος/νη στον ιδιωτικό τομέα' },
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.3', id: 'A2_3', name: 'A2_3', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.5', id: 'A2_5', name: 'A2_5', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.6', id: 'A2_6', name: 'A2_6', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.7', id: 'A2_7', name: 'A2_7', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }
  ];

  public static publicSecOptions = [
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Απασχολούμενος/νη στο Δημόσιο Τομέα (ΝΠΔΔ και ΝΠΙΔ)' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A3.3', id: 'A3_3', name: 'A3_3', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A3.4', id: 'A3_4', name: 'A3_4', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  public static jobRelationOtherThanAbove = [
    { subCategory: 'A5.1', id: 'A5_1', name: 'A5_1', text: 'Σχέση εργασίας (άλλη) που δεν εμπίπτει σε καμία απο τις παραπάνω κατηγορίες' }
  ]

  public static specialJobOptions = [
    { subCategory: 'A6.1', id: 'A6_1', name: 'A6_1', text: 'Δεν ανήκω σε καμία από τις παραπάνω κατηγορίες (Δεν είμαι ούτε εγγεγραμένος/η άνεργος/η στον ΟΑΕΔ ούτε εργαζόμενος/η - αυτοαπασχολούμενος/η )' },
    { subCategory: 'A6.2', id: 'A6_2', name: 'A6_2', text: 'Δεν είμαι εγγεγραμμένος στον ΟΑΕΔ ούτε εργάζομαι αλλά αναζητώ εργασία' },
    { subCategory: 'A6.3', id: 'A6_3', name: 'A6_3', text: 'Είμαι 25 ετών και άνω και πριν την είσοδό μου στο πρόγραμμα αναζητούσα εργασία για πάνω από 12 μήνες' },
    { subCategory: 'A6.4', id: 'A6_4', name: 'A6_4', text: 'Είμαι κάτω των 25 ετών πριν την είσοδό μου στο πρόγραμμα αναζητούσα εργασία για πάνω από 6 μήνες' },
    { subCategory: 'A6.5', id: 'A6_5', name: 'A6_5', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμμένος άνεργος, δεν αναζητώ εργασία' }
  ];

  public static educationOptions = [
    { subCategory: 'B1.1', id: 'B1_1', name: 'B1_1', text: 'Συμμετέχετε σε κάποιο άλλο πρόγραμμα κατάρτισης ή εκπαίδευσης ή διά βίου μάθησης, επιδοτούμενο ή μη;' },
    { subCategory: 'B1.2', id: 'B1_2', name: 'B1_2', text: 'Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B1.3', id: 'B1_3', name: 'B1_3', text: 'Μαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (Δημοτικό, Γυμνάσιο, Λύκειο. Συμπεριλαμβάνονται και τα Σχολεία Δεύτερης Ευκαιρίας)' },
    { subCategory: 'B1.4', id: 'B1_4', name: 'B1_4', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης ή σε ΙΕΚ ή σε Κολλέγιο ή σε Σχολές που εποπτεύονται από άλλα Υπουργεία εκτός του Υπουργείου Παιδείας, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'B1.5', id: 'B1_5', name: 'B1_5', text: 'Συμμετέχων/ουσα σε κάποιο πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης (π.χ. ΚΕΚ)' },
    { subCategory: 'B1.6', id: 'B1_6', name: 'B1_6', text: 'Συμμετέχων/ουσα σε πρόγραμμα πρακτικής άσκησης με αμοιβή (ως φοιτητής τριτοβάθμιας εκπαίδευση, σπουδαστής ΙΕΚ, τουριστικών σχολών, Ακαδημίας Εμπορικού Ναυτικού, κτλ)' },
    { subCategory: 'B1.7', id: 'B1_7', name: 'B1_7', text: 'Μεταπτυχιακός/ή Φοιτητής/τρια ή υποψήφιος/α Διδάκτωρ' }
  ];

  public static educationalStandardOptions = [
    { subCategory: 'B2.1', id: 'B2_1', name: 'B2_1', text: 'Δεν έχω αποφοιτήσει από το δημοτικό' },
    { subCategory: 'B2.2', id: 'B2_2', name: 'B2_2', text: 'Απόφοιτος δημοτικού' },
    { subCategory: 'B2.3', id: 'B2_3', name: 'B2_3', text: 'Απόφοιτος γυμνασίου' },
    { subCategory: 'B2.4', id: 'B2_4', name: 'B2_4', text: 'Απόφοιτος λυκείου' },
    { subCategory: 'B2.5', id: 'B2_5', name: 'B2_5', text: 'Απόφοιτος ΙΕΚ, ή ιδιωτικού κολλεγίου, ή σχολών που εποπτεύονται από άλλα Υπουργεία' },
    { subCategory: 'B2.6', id: 'B2_6', name: 'B2_6', text: 'Απόφοιτος ΑΕΙ/ΤΕΙ' },
    { subCategory: 'B2.7', id: 'B2_7', name: 'B2_7', text: 'Κάτοχος μεταπτυχιακού διπλώματος' },
    { subCategory: 'B2.8', id: 'B2_8', name: 'B2_8', text: 'Κάτοχος διδακτορικού διπλώματος' }
  ];

  public static demographicsOptions = [
    { subCategory: 'C1.1', id: 'C1_1', name: 'C1_1', text: 'Έχει γεννηθεί ένας ή και οι δύο γονείς σας στο εξωτερικό (σε οποιαδήποτε χώρα, εντός ή εκτός της ΕΕ).;' },
    { subCategory: 'C1.2', id: 'C1_2', name: 'C1_2', text: 'Μουσουλμανική Μειονότητα της Θράκης' },
    { subCategory: 'C1.3', id: 'C1_3', name: 'C1_3', text: 'Ρομά' },
    { subCategory: 'C1.4', id: 'C1_4', name: 'C1_4', text: 'Mετανάστες' },
    { subCategory: 'C1.5', id: 'C1_5', name: 'C1_5', text: 'Πρόσφυγες / Δικαιούχοι επικουρικής προστασίας/αιτούντες άσυλο ή αιτούντες διεθνή προστασία' },
    { subCategory: 'C1.6', id: 'C1_6', name: 'C1_6', text: 'Άτομα με Αναπηρία με πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.)' },
    { subCategory: 'C1.7', id: 'C1_7', name: 'C1_7', text: 'Άτομα με Αναπηρία χωρίς πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.)' },
    { subCategory: 'C1.8', id: 'C1_8', name: 'C1_8', text: 'Aπεξαρτημένα άτομα / άτομα υπό απεξάρτηση' },
    { subCategory: 'C1.9', id: 'C1_9', name: 'C1_9', text: 'Φυλακισμένοι/Αποφυλακισμένοι' },
    { subCategory: 'C1.10', id: 'C1_10', name: 'C1_10', text: 'Άστεγοι ή άτομα που έχουν αποκλειστεί από τη στέγαση' },
    { subCategory: 'C1.11', id: 'C1_11', name: 'C1_11', text: 'Δικαιούχοι Ελάχιστου Εγγυημένου Εισοδήματος' }
  ];

  //OutputSheets
  public static unemployedOptionOutputSheet = [
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Δεν είμαι εγγεγραμμένος/νη στον ΟΑΕΔ, ούτε εργάζομαι, αλλά αναζητώ εργασία και είμαι άμεσα διαθέσιμος/η να εργαστώ', },
    { subCategory: 'A1.2', id: 'A1_2', name: 'A1_2', text: 'Είμαι εγγεγραμμένος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ' },
    { subCategory: 'A1.3', id: 'A1_3', name: 'A1_3', text: 'Είμαι εργαζόμενος/η αυτοαπασχολούμενος/η' },
    { subCategory: 'A1.4', id: 'A1_4', name: 'A1_4', text: 'Τίποτα από τα παραπάνω (δεν εργάζομαι, δεν είμαι εγγεγραμμένος άνεργος/η, δεν αναζητώ εργασία)' }
  ];

  public static privateSecOptionsOutputSheet = [
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Η θέση απασχόλησης που κατέχετε αυτή τη στιγμή, συγχρηματοδοτείται στο πλαίσιο προγράμματος του ΕΣΠΑ' },
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Απασχολούμενος/νη στον ιδιωτικό τομέα:' },
    { subCategory: 'A2.3', id: 'A2_3', name: 'A2_3', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.5', id: 'A2_5', name: 'A2_5', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.6', id: 'A2_6', name: 'A2_6', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.7', id: 'A2_7', name: 'A2_7', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.8', id: 'A2_8', name: 'A2_8', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }
  ];

  public static publicSecOptionsOutputSheet = [
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Απασχολούμενος/νη στο Δημόσιο Τομέα (ΝΠΔΔ και ΝΠΙΔ)' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A3.3', id: 'A3_3', name: 'A3_3', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A3.4', id: 'A3_4', name: 'A3_4', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  public static selfEmployedOutputSheet = [
    { subCategory: 'A4.1', id: 'A4_1', name: 'A4_1', text: 'Είμαι αυτοαπασχολούμενος/η' }
  ];

  public static jobDetailsOutputSheet = [
    { subCategory: 'A5.1', id: 'A5_1', name: 'A5_1', text: 'Μετά την ημερομηνία λήξης συμμετοχής σας σε αυτό το πρόγραμμα συμμετέχετε σε κάποιο άλλο πρόγραμμα εκπαίδευσης' },
    { subCategory: 'A5.2', id: 'A5_2', name: 'A5_2', text: 'Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'A5.3', id: 'A5_3', name: 'A5_3', text: 'Μαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (Δημοτικό, Γυμνάσιο, Λύκειο. Συμπεριλαμβάνονται και τα Σχολεία Δεύτερης Ευκαιρίας)' },
    { subCategory: 'A5.4', id: 'A5_4', name: 'A5_4', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης ή σε ΙΕΚ ή σε Κολλέγιο ή σε Σχολές που εποπτεύονται από άλλα Υπουργεία εκτός του Υπουργείου Παιδείας, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'A5.5', id: 'A5_5', name: 'A5_5', text: 'Συμμετέχων/ουσα σε κάποιο πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης (π.χ. ΚΕΚ)' },
    { subCategory: 'A5.6', id: 'A5_6', name: 'A5_6', text: 'Συμμετέχων/ουσα σε πρόγραμμα πρακτικής άσκησης με αμοιβή (ως φοιτητής τριτοβάθμιας εκπαίδευση, σπουδαστής ΙΕΚ, τουριστικών σχολών, Ακαδημίας Εμπορικού Ναυτικού, κτλ)' },
    { subCategory: 'A5.7', id: 'A5_7', name: 'A5_7', text: 'Μεταπτυχιακός/ή Φοιτητής/τρια ή υποψήφιος/α Διδάκτωρ' },
    { subCategory: 'A5.8', id: 'A5_8', name: 'A5_8', text: 'Το νέο πρόγραμμα εκπαίδευσης ή κατάρτισης στο οποίο συμμετέχετε, συγχρηματοδοτείται στο πλαίσιο προγράμματος του ΕΣΠΑ' }
  ];

  public static internshipExperienceOutputSheet = [
    { subCategory: 'B1.1', id: 'B1_1', name: 'B1_1', text: 'Αποκτήθηκε εξειδίκευση ως αποτέλεσμα της συμμετοχής σας στην πρακτική άσκηση;' },
  ];

  public static getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }
}


import Swal from 'sweetalert2';

export abstract class Utils {

  static displayErrorSwal(displayText: string) {
    Swal.fire({
      title: 'Σφάλμα',
      text: displayText,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  static displaySuccessSwal(displayText: string) {
    Swal.fire({
      title: 'Επιτυχία',
      text: displayText,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

  public static CustomDialogAction = {
    CANCEL : 'CANCEL',
    OK : 'OK'
  }

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
    if (!dateOfBirth) {
      return '';
    }

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

  public static sortStudentsData(data: any[], isSortDirectionUp: boolean): any[] {
    return data.slice().sort((a: any, b: any) => {
      const nameA = `${a.givenname} ${a.sn}`.toUpperCase();
      const nameB = `${b.givenname} ${b.sn}`.toUpperCase();

      if (isSortDirectionUp) {
        return nameA.localeCompare(nameB); // Ascending order
      } else {
        return nameB.localeCompare(nameA); // Descending order
      }
    });
  }

  public static sortStudentsDataGeneric<T>(data: T[], isAscending: boolean, property: keyof T): T[] {
    return data.slice().sort((a: T, b: T) => {
      const valueA = `${a[property]}`.toUpperCase();
      const valueB = `${b[property]}`.toUpperCase();

      return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });
  }

  public static sortStudentsNumericData(data: any[], isSortDirectionUp: boolean): any[] {
    return data.slice().sort((a: any, b: any) => {
      const nameA = `${a.schacpersonaluniquecode}`;
      const nameB = `${b.schacpersonaluniquecode}`;

      if (isSortDirectionUp) {
        return nameA.localeCompare(nameB); // Ascending order
      } else {
        return nameB.localeCompare(nameA); // Descending order
      }
    });
  }

  public static getAEICodeFromDepartmentId(departmentId: number): number {
    return parseInt(departmentId.toString().substring(0, 4));
  }

  public static isTechTEIDepartment(departmentId: number): boolean {
    return departmentId.toString().length == 6;
  }

  public static getAM(str: string): string {
    const personalIdArray = str.split(":");
    return personalIdArray[personalIdArray.length - 1];
  }

  public static displayErrorPrivilegesSwal(message: string) {
    Swal.fire({
      icon: 'error',
      title: 'Ανεπαρκή δικαιώματα χρήστη',
      text: message,
    });
  }

  public static async getBase64Image(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  static mapFormDataToAnswers(formData: any, keyName: string, valueName: string): any {
    return Object.entries(formData).map(([key, value]) => ({
      [keyName]: key,
      [valueName]: value,
    }));
  }

  // InputSheets
  public static workBeforeInternship = [
    { subCategory: 'A0.1', id: 'A0_1', name: 'A0_1', text: 'Πριν την αίτηση συμμετοχής σας στο πρόγραμμα αναζητούσατε εργασία;' },
    { subCategory: 'A0.2', id: 'A0_2', name: 'A0_2', text: 'Πριν την αίτηση συμμετοχής σας στο πρόγραμμα ήσασταν άμεσα διαθέσιμος/η για εργασία; (δηλ. θα εργαζόσασταν αν σας δινόταν η ευκαιρία)' },
  ];

  public static unemployedOption = [
    { subCategory: 'A1', id: 'A1', name: 'A1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στο ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)', },
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι 25 ετών και άνω και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ και διάστημα ανεργίας πάνω απο δώδεκα (12) συνεχείς μήνες; (>12 μήνες)' },
    { subCategory: 'A1.2', id: 'A1_2', name: 'A1_2', text: 'Είμαι κάτω των 25 ετών και εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας πάνω από έξι (6) συνεχείς μήνες; (>6 μήνες)' }
  ];

  public static privateSecOptions = [
    { subCategory: 'A2', id: 'A2', name: 'A2', text: 'Είμαι εργαζόμενος/νη ή αυτοαπασχολούμενος/νη' },
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Απασχολούμενος/νη στον ιδιωτικό τομέα' },
    { subCategory: 'A2.1.1', id: 'A2_1_1', name: 'A2_1_1', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.1.2', id: 'A2_1_2', name: 'A2_1_2', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.1.3', id: 'A2_1_3', name: 'A2_1_3', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.1.4', id: 'A2_1_4', name: 'A2_1_4', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.1.5', id: 'A2_1_5', name: 'A2_1_5', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.1.6', id: 'A2_1_6', name: 'A2_1_6', text: 'Απασχολούμαι αμειβόμενος/νη με εργόσημο' }
  ];

  public static publicSecOptions = [
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Απασχολούμενος/νη στο Δημόσιο Τομέα (ΝΠΔΔ και ΝΠΙΔ)' },
    { subCategory: 'A2.2.1', id: 'A2_2_1', name: 'A2_2_1', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A2.2.2', id: 'A2_2_2', name: 'A2_2_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A2.2.3', id: 'A2_2_3', name: 'A2_2_3', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  public static WorkOptionsMIS2127= [
    { subCategory: 'A1', id: 'A1', name: 'A1', text: 'Είμαι Εγγεγραμμένος/νη άνεργος/η στη ΔΥΠΑ', },
    { subCategory: 'A1.1', id: 'A1_1', name: 'A1_1', text: 'Είμαι εγγεγραμμένος άνεργος στον ΟΑΕΔ με πρόσφατο διάστημα ανεργίας περισσότερο από δώδεκα (12) και πάνω συνεχείς μήνες (>=12 μήνες)' },
    { subCategory: 'Α2.Π1', id: 'A2P1', name: 'A2P1', text: 'Είμαι εργαζόμενος/νη (ΠΣ ΕΡΓΑΝΗ)' },
    { subCategory: 'A2.Π2', id: 'A2P2', name: 'A2P2', text: 'Είμαι εργαζόμενος/νη (ΠΣ ΑΑΔΕ αυτοαπασχολούμενος)' },
    { subCategory: 'A2.Π3', id: 'A2P3', name: 'A2P3', text: 'Είμαι εργαζόμενος/νη (ΠΣ Μητρώο Δημοσίων Υπαλλήλων)' },
    { subCategory: 'A3', id: 'A3', name: 'A3', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμμένος/νη άνεργος/η στη ΔΥΠΑ' }
  ];

  public static jobRelationOtherThanAbove = [
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Σχέση εργασίας (άλλη) που δεν εμπίπτει σε καμία απο τις παραπάνω κατηγορίες' }
  ]

  public static specialJobOptions = [
    { subCategory: 'A3', id: 'A3', name: 'A3', text: 'Δεν ανήκω σε καμία από τις παραπάνω κατηγορίες (Δεν είμαι ούτε εγγεγραμένος/η άνεργος/η στον ΟΑΕΔ ούτε εργαζόμενος/η - αυτοαπασχολούμενος/η )' },
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Δεν είμαι εγγεγραμμένος στον ΟΑΕΔ ούτε εργάζομαι αλλά αναζητώ εργασία και είμαι άμεσα διαθέσιμος να εργαστώ' },
    { subCategory: 'A3.1.1', id: 'A3_1_1', name: 'A3_1_1', text: 'Είμαι 25 ετών και άνω και πριν την είσοδό μου στο πρόγραμμα αναζητούσα εργασία για πάνω από δώδεκα (12) συνεχείς μήνες' },
    { subCategory: 'A3.1.2', id: 'A3_1_2', name: 'A3_1_2', text: 'Είμαι κάτω των 25 ετών πριν την είσοδό μου στο πρόγραμμα αναζητούσα εργασία για πάνω από έξι (6) συνεχείς μήνες' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμμένος άνεργος, δεν αναζητώ εργασία' }
  ];

  public static educationOptions = [
    { subCategory: 'B', id: 'B', name: 'B', text: 'Συμμετέχετε σε κάποιο άλλο πρόγραμμα κατάρτισης ή εκπαίδευσης ή διά βίου μάθησης, επιδοτούμενο ή μη; Αν ναι, σημειώστε σε ποια από τις παρακάτω κατηγορίες ανήκετε: ' },
    { subCategory: 'B1', id: 'B1', name: 'B1', text: 'Mαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (∆ημοτικό, Γυμνάσιο, Λύκειο. Συμπεριλαμβάνονται και τα Σχολεία ∆εύτερης Ευκαιρίας)' },
    { subCategory: 'B2', id: 'B2', name: 'B2', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης (ΣΕΚ ή ΕΣΚ) ή Επαγγελματική Σχολή Μαθητείας (ΕΠΑΣ) ή σε ΙΕΚ ή σε Κολλέγιο ή σε Σχολές που εποπτεύονται από άλλα Υπουργεία εκτός του Υπουργείου Παιδείας, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'B3', id: 'B3', name: 'B3', text: 'Συμμετέχων/ουσα σε κάποιο πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης (π.χ ΚΕΚ)' },
    { subCategory: 'B4', id: 'B4', name: 'B4', text: 'Είμαι Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B5', id: 'B5', name: 'B5', text: 'Συμμετέχω σε πρόγραμμα πρακτικής άσκησης με αμοιβή(ως φοιτητής τριτοβάθμιας εκπαίδευσης, σπουδαστής ΙΕΚ, τουριστικών σχολών, Ακαδημίας Εμπορικού Ναυτικού κτλ)' },
    { subCategory: 'B6', id: 'B6', name: 'B6', text: 'Μεταπτυχιακός/ή Φοιτητής/τρια ή υποψήφιος/α Διδάκτωρ' }
  ];

  public static educationOptionsMIS2127 = [
    { subCategory: 'B', id: 'B', name: 'B', text: 'Αμέσως πριν την είσοδό σας στη δράση, συμμετείχατε σε κατάρτιση ή εκπαίδευση ή διά βίου μάθηση, ή μαθητεία ή πρακτική άσκηση' },
    { subCategory: 'B1', id: 'B1', name: 'B1', text: 'Μαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (Δημοτικό, Γυμνάσιο, Λύκειο. (Συμπεριλαμβάνονται τα Σχολεία Δεύτερης Ευκαιρίας και τα ΕΠΑΛ)' },
    { subCategory: 'B2', id: 'B2', name: 'B2', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης (ΣΕΚ ή ΕΣΚ) ή Επαγγελματική Σχολή Μαθητείας (ΕΠΑΣ) ή σε ΙΕΚ /Σ.Α.Ε.Κ ή σε Κολλέγιο ή Τεχνικές Επαγγελματικές Σχολές, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'B3', id: 'B3', name: 'B3', text: 'Είμαι Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B4', id: 'B4', name: 'B4', text: 'Μεταπτυχιακός Φοιτητής/τρια ή υποψήφιος/ια Διδάκτωρ' },
    { subCategory: 'B5', id: 'B5', name: 'B5', text: 'Συμμετέχων/ουσα σε πρόγραμμα μη τυπικής μάθησης (πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης, πρόγραμμα γενικής εκπαίδευσης ενηλίκων)' },
  ];

  public static educationalStandardOptions = [
    { subCategory: 'C1', id: 'C1', name: 'C1', text: '∆εν έχω αποφοιτήσει από το δημοτικό σχολείο' },
    { subCategory: 'C2', id: 'C2', name: 'C2', text: 'Απόφοιτος/η ∆ημοτικού Σχολείου' },
    { subCategory: 'C3', id: 'C3', name: 'C3', text: 'Απόφοιτος/η Γυμνασίου ή Σ∆Ε (Σχολεία ∆εύτερης Ευκαιρίας)' },
    { subCategory: 'C4', id: 'C4', name: 'C4', text: 'Απόφοιτος/η Σχολών Επαγγελματικής Κατάρτισης (Σ.Ε.Κ.), των Επαγγελματικών Σχολών Κατάρτισης (Ε.Σ.Κ.) ή Επαγγελματικών Σχολών Μαθητείας (ΕΠΑ.Σ.) του Ο.Α.Ε.∆., μετά από πιστοποίηση, καθώς και Ι.Ε.Κ. μετά από κατάρτιση μέχρι δύο εξαμήνων ή Τεχνικών Επαγγελματικών Σχολών του Υπ. Παιδείας & Θρησκευμάτων και εξομοιούμενων με αυτές σχολών άλλων Υπουργείων' },
    { subCategory: 'C5', id: 'C5', name: 'C5', text: 'Απόφοιτος/η Λυκείου (Γενικού ή Επαγγελματικού) ή κάτοχος πτυχίου επαγγελματικής ειδικότητας, εκπαίδευσης και κατάρτισης, που χορηγείται στους αποφοίτους της Γ΄ Τάξης των Επαγγελματικών Λυκείων (ΕΠΑ.Λ.) μετά από ενδοσχολικές εξετάσεις, καθώς και βεβαιώσεων ολοκλήρωσης μεταλυκειακού έτους μαθητείας των ΕΠΑ.Λ. ή ολοκλήρωσης μεταδευτεροβάθμιας μη - τριτοβάθμιας εκπαίδευσης (ΙΕΚ)' },
    { subCategory: 'C6', id: 'C6', name: 'C6', text: 'Κάτοχος πτυχίου επαγγελματικής ειδικότητας, εκπαίδευσης και κατάρτισης, που χορηγείται στους αποφοίτους της Τάξης Μαθητείας των ΕΠΑ.Λ., μετά από πιστοποίηση ή διπλώματος επαγγελματικής ειδικότητας, εκπαίδευσης και κατάρτισης, που χορηγείται στους αποφοίτους Ι.Ε.Κ. μετά από πιστοποίηση ή διπλώματος/πτυχίου ανώτερης σχολής (τριτοβάθμιας Πρότυπο Απογραφικό 5ης ΠΠ Σεπτέμβριος 2021 αα πρότυπο 15 (ΠΑΝ), έκδοση 3 ∆ελτίο Εισόδου ανώτερης και όχι ανώτατης εκπαίδευσης) ή ιδιωτικού Κολλεγίου ή Σχολών που εποπτεύονται από άλλα Υπουργεία (Πολιτισμού, Ναυτιλίας, Τουρισμού κλπ) ' },
    { subCategory: 'C7', id: 'C7', name: 'C7', text: 'Απόφοιτος/η ΑΕΙ/ΤΕΙ' },
    { subCategory: 'C8', id: 'C8', name: 'C8', text: 'Κάτοχος Μεταπτυχιακού ∆ιπλώματος' },
    { subCategory: 'C9', id: 'C9', name: 'C9', text: 'Κάτοχος ∆ιδακτορικού ∆ιπλώματος' }
  ];

  public static demographicsOptions = [
    { subCategory: 'D4', id: 'D4', name: 'D4', text: 'Έχει γεννηθεί ένας ή και οι δύο γονείς σας στο εξωτερικό (σε οποιαδήποτε χώρα, εντός ή εκτός της ΕΕ).;' },
    { subCategory: 'D5', id: 'D5', name: 'D5', text: 'Μουσουλμανική Μειονότητα της Θράκης' },
    { subCategory: 'D6', id: 'D6', name: 'D6', text: 'Ρομά' },
    { subCategory: 'D7', id: 'D7', name: 'D7', text: 'Mετανάστες' },
    { subCategory: 'D8', id: 'D8', name: 'D8', text: 'Πρόσφυγες / Δικαιούχοι επικουρικής προστασίας/αιτούντες άσυλο ή αιτούντες διεθνή προστασία' },
    { subCategory: 'D9', id: 'D9', name: 'D9', text: 'Απεξαρτημένα άτομα / άτομα υπό απεξάρτηση' },
    { subCategory: 'D10', id: 'D10', name: 'D10', text: 'Φυλακισμένοι /Αποφυλακισμένοι/Ανήλικοι παραβάτες' },
    { subCategory: 'D11', id: 'D11', name: 'D11', text: 'Άτομα με Αναπηρία με πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.) ' },
    { subCategory: 'D12', id: 'D12', name: 'D12', text: 'Άτομα με Αναπηρία χωρίς πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.) ' },
    { subCategory: 'D13', id: 'D13', name: 'D13', text: 'Άστεγοι ή άτομα που έχουν αποκλειστεί από τη στέγαση' },
    { subCategory: 'D14', id: 'D14', name: 'D14', text: '∆ικαιούχοι Κοινωνικού Εισοδήματος Αλληλεγγύης' }
  ];

  public static demographicsOptionsMIS2127 = [
    { subCategory: 'D1', id: 'D1', name: 'D1', text: 'Άτομα με Αναπηρία' },
    { subCategory: 'D1P', id: 'D1P', name: 'D1P', text: 'Άτομα με Αναπηρία με πιστοποίηση από το Κέντρο Πιστοποίησης Αναπηρίας (ΚΕ.Π.Α.)' },
    { subCategory: 'D2', id: 'D2', name: 'D2', text: 'Υπήκοοι τρίτης χώρας' },
    { subCategory: 'D2A', id: 'D2A', name: 'D2A', text: 'Μετανάστες' },
    { subCategory: 'D2B', id: 'D2B', name: 'D2B', text: 'Δικαιούχοι Διεθνούς Προστασίας, Αιτούντες άσυλο ή αιτούντες διεθνή προστασία και Ασυνόδευτοι ανήλικοι' },
    { subCategory: 'D2C', id: 'D2C', name: 'D2C', text: 'Εκτοπισθέντες / δικαιούχοι προσωρινής προστασίας' },
    { subCategory: 'D3', id: 'D3', name: 'D3', text: 'Έχει γεννηθεί ένας ή και οι δύο γονείς σας στο εξωτερικό (σε οποιαδήποτε χώρα).' },
    { subCategory: 'D4', id: 'D4', name: 'D4', text: 'Μουσουλμανική Μειονότητα της Θράκης' },
    { subCategory: 'D5', id: 'D5', name: 'D5', text: 'Ρομά' },
    { subCategory: 'D6', id: 'D6', name: 'D6', text: 'Άστεγοι ή άτομα που έχουν αποκλειστεί από τη στέγαση' }
  ];

  // OutputSheets
  public static unemployedOptionOutputSheet = [
    { subCategory: 'A1', id: 'A1', name: 'A1', text: 'Είμαι εγγεγραμμένος/η άνεργος/η στον ΟΑΕΔ με κάρτα ανεργίας σε ισχύ (συμπεριλαμβάνονται και οι εποχικά εργαζόμενοι για το διάστημα που δεν εργάζονται)' }
  ];

  public static workingOptionsOutputSheet = [
    { subCategory: 'A2', id: 'A2', name: 'A2', text: 'Είμαι εργαζόμενος/νη ή αυτοαπασχολούμενος/νη' },
    { subCategory: 'A2.0', id: 'A2_0', name: 'A2_0', text: 'Αν έχετε απαντήσει ΝΑΙ στην ερώτηση Α2, η θέση απασχόλησης που κατέχετε συγχρηματοδοτείται στο πλαίσιο προγράμματος του ΕΣΠΑ;' }
  ]

  public static privateSecOptionsOutputSheet = [
    { subCategory: 'A2.1', id: 'A2_1', name: 'A2_1', text: 'Απασχολούμενος/νη στον ιδιωτικό τομέα:' },
    { subCategory: 'A2.1.1', id: 'A2_1_1', name: 'A2_1_1', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.1.2', id: 'A2_1_2', name: 'A2_1_2', text: 'Απασχολούμαι με σύμβαση εργασίας πλήρους απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.1.3', id: 'A2_1_3', name: 'A2_1_3', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και αορίστου χρόνου' },
    { subCategory: 'A2.1.4', id: 'A2_1_4', name: 'A2_1_4', text: 'Απασχολούμαι με σύμβαση εργασίας μερικής απασχόλησης και ορισμένου χρόνου (συμπεριλαμβάνεται η εποχική απασχόληση)' },
    { subCategory: 'A2.1.5', id: 'A2_1_5', name: 'A2_1_5', text: 'Απασχολούμαι με εκ περιτροπής απασχόληση' },
    { subCategory: 'A2.1.6', id: 'A2_1_6', name: 'A2_1_6', text: 'Απασχολούμαι αμειβόμενος/η με εργόσημο' }
  ];

  public static publicSecOptionsOutputSheet = [
    { subCategory: 'A2.2', id: 'A2_2', name: 'A2_2', text: 'Απασχολούμενος/νη στο Δημόσιο Τομέα (ΝΠΔΔ και ΝΠΙΔ)' },
    { subCategory: 'A2.2.1', id: 'A2_2_1', name: 'A2_2_1', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου αορίστου χρόνου' },
    { subCategory: 'A2.2.2', id: 'A2_2_2', name: 'A2_2_2', text: 'Απασχολούμαι με σύμβαση ιδιωτικού δικαίου ορισμένου χρόνου' },
    { subCategory: 'A2.2.3', id: 'A2_2_3', name: 'A2_2_3', text: 'Απασχολούμαι ως Μόνιμος Δημόσιος Υπάλληλος' }
  ];

  public static selfEmployedOutputSheet = [
    { subCategory: 'A2.3', id: 'A2_3', name: 'A2_3', text: 'Είμαι αυτοαπασχολούμενος/η' }
  ];

  public static jobRelationOtherThanAboveOutputSheet = [
    { subCategory: 'A2.4', id: 'A2_4', name: 'A2_4', text: 'Σχέση εργασίας (άλλη) που δεν εμπίπτει σε καμία απο τις παραπάνω κατηγορίες' }
  ]

  public static specialJobOptionsOutputSheet = [
    { subCategory: 'A3', id: 'A3', name: 'A3', text: 'Δεν ανήκω σε καμία από τις παραπάνω κατηγορίες (Δεν είμαι ούτε εγγεγραμένος/η άνεργος/η στον ΟΑΕΔ ούτε εργαζόμενος/η - αυτοαπασχολούμενος/η )' },
    { subCategory: 'A3.1', id: 'A3_1', name: 'A3_1', text: 'Δεν είμαι εγγεγραμμένος/νη στον ΟΑΕΔ, ούτε εργάζομαι, αλλά αναζητώ εργασία και είμαι άμεσα διαθέσιμος να εργαστώ' },
    { subCategory: 'A3.2', id: 'A3_2', name: 'A3_2', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμμένος άνεργος , δεν αναζητώ εργασία' }
  ];

public static workOptionsOutputSheetMIS2127= [
    { subCategory: 'A1', id: 'A1', name: 'A1', text: 'Είμαι εγγεγραμμένος/νη άνεργος/η στη ΔΥΠΑ 4 εβδομάδες μετά την έξοδο από την πράξη', },
    { subCategory: 'Α1.6M', id: 'Α16M', name: 'Α16M', text: 'Είμαι Άνεργος 6 μήνες μετά την έξοδο από την πράξη (ΠΣ ΔΥΠΑ)' },
    { subCategory: 'Α2.Π1', id: 'A2P1', name: 'A2P1', text: 'Είμαι εργαζόμενος/νη (ΠΣ ΕΡΓΑΝΗ) 4 εβδομάδες μετά την έξοδο από την πράξη' },
    { subCategory: 'A2.Π2', id: 'A2P2', name: 'A2P2', text: 'Είμαι εργαζόμενος/νη (ΠΣ ΑΑΔΕ αυτοαπασχολούμενος) 4 εβδομάδες μετά την έξοδο από την πράξη' },
    { subCategory: 'A2.Π3', id: 'A2P3', name: 'A2P3', text: 'Είμαι εργαζόμενος/νη (ΠΣ Μητρώο Δημοσίων Υπαλλήλων) 4 εβδομάδες μετά την έξοδο από την πράξη' },
    { subCategory: 'Α2.Π1.6Μ', id: 'A2P16M', text:'Είμαι εργαζόμενος 6 μήνες μετά την έξοδο από την πράξη (ΠΣ ΕΡΓΑΝΗ)' },
    { subCategory: 'Α2.Π2.6Μ', id: 'A2P26M', text: 'Είμαι εργαζόμενος 6 μήνες μετά την έξοδο από την πράξη (ΠΣ ΓΓΠΣ αυτοαπασχολούμενος)'},
    { subCategory: 'Α2.Π3.6Μ', id: 'A2P36M', text: 'Είμαι εργαζόμενος 6 μήνες μετά την έξοδο από την πράξη (ΠΣ Μητρώο Δημοσίων Υπαλλήλων)'},
    { subCategory: 'A3', id: 'A3', name: 'A3', text: 'Δεν εργάζομαι, δεν είμαι εγγεγραμμένος/νη άνεργος/η στη ΔΥΠΑ' }
  ];

  public static educationOptionsOutputSheet = [
    { subCategory: 'B', id: 'B', name: 'B', text: 'Συμμετέχετε σε κάποιο άλλο πρόγραμμα κατάρτισης ή εκπαίδευσης ή διά βίου μάθησης, επιδοτούμενο ή μη; Αν ναι, σημειώστε σε ποια από τις παρακάτω κατηγορίες ανήκετε: ' },
    { subCategory: 'B0', id: 'B0', name: 'B0', text: 'Το πρόγραμμα εκπαίδευσης ή κατάρτισης ή δια βίου μάθησης στο οποίο συμμετέχετε, συγχρηματοδοτείται στο πλαίσιο προγράμματος του ΕΣΠΑ;' },
    { subCategory: 'B1', id: 'B1', name: 'B1', text: 'Mαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (∆ημοτικό, Γυμνάσιο, Λύκειο. Συμπεριλαμβάνονται και τα Σχολεία ∆εύτερης Ευκαιρίας)' },
    { subCategory: 'B2', id: 'B2', name: 'B2', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης (ΣΕΚ ή ΕΣΚ) ή Επαγγελματική Σχολή Μαθητείας (ΕΠΑΣ) ή σε ΙΕΚ ή σε Κολλέγιο ή σε Σχολές που εποπτεύονται από άλλα Υπουργεία εκτός του Υπουργείου Παιδείας, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'B3', id: 'B3', name: 'B3', text: 'Συμμετέχων/ουσα σε κάποιο πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης (π.χ ΚΕΚ)' },
    { subCategory: 'B4', id: 'B4', name: 'B4', text: 'Είμαι Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B5', id: 'B5', name: 'B5', text: 'Συμμετέχω σε πρόγραμμα πρακτικής άσκησης με αμοιβή(ως φοιτητής τριτοβάθμιας εκπαίδευσης, σπουδαστής ΙΕΚ, τουριστικών σχολών, Ακαδημίας Εμπορικού Ναυτικού κτλ)' },
    { subCategory: 'B6', id: 'B6', name: 'B6', text: 'Μεταπτυχιακός/ή Φοιτητής/τρια ή υποψήφιος/α Διδάκτωρ' }
  ];

  public static educationOptionsOutputSheetMIS2127 = [
    { subCategory: 'B', id: 'B', name: 'B', text: 'Μετά την ημερομηνία λήξης συμμετοχής σας στη δράση και για το διάστημα ως και 4 εβδομάδες μετά από αυτήν, συμμετείχατε σε κατάρτιση ή εκπαίδευση ή διά βίου μάθηση, ή μαθητεία ή πρακτική άσκηση;' },
    { subCategory: 'B1', id: 'B1', name: 'B1', text: 'Μαθητής/τρια πρωτοβάθμιας ή δευτεροβάθμιας εκπαίδευσης (Δημοτικό, Γυμνάσιο, Λύκειο. (Συμπεριλαμβάνονται τα Σχολεία Δεύτερης Ευκαιρίας και τα ΕΠΑΛ)' },
    { subCategory: 'B2', id: 'B2', name: 'B2', text: 'Σπουδαστής/τρια σε Σχολή Επαγγελματικής Κατάρτισης (ΣΕΚ ή ΕΣΚ) ή Επαγγελματική Σχολή Μαθητείας (ΕΠΑΣ) ή σε ΙΕΚ /Σ.Α.Ε.Κ ή σε Κολλέγιο ή Τεχνικές Επαγγελματικές Σχολές, όπως π.χ. η Ναυτική Ακαδημία, Τουριστικές Σχολές κλπ' },
    { subCategory: 'B3', id: 'B3', name: 'B3', text: 'Είμαι Φοιτητής/τρια τριτοβάθμιας εκπαίδευσης πλήρους φοίτησης' },
    { subCategory: 'B4', id: 'B4', name: 'B4', text: 'Μεταπτυχιακός Φοιτητής/τρια ή υποψήφιος/ια Διδάκτωρ' },
    { subCategory: 'B5', id: 'B5', name: 'B5', text: 'Συμμετέχων/ουσα σε πρόγραμμα μη τυπικής μάθησης (πρόγραμμα συνεχιζόμενης επαγγελματικής κατάρτισης, πρόγραμμα γενικής εκπαίδευσης ενηλίκων)' },
  ];

  public static internshipExperienceOutputSheet = [
    { subCategory: 'E1', id: 'E1', name: 'E1', text: 'Αποκτήθηκε εξειδίκευση μετά την συμμετοχή σας στο πρόγραμμα (πιστοποιητικό, δίπλωμα, πτυχίο κοκ)' },
    { subCategory: 'E2', id: 'E2', name: 'E2', text: 'Έχετε λάβει προσφορά/πρόταση για θέση εργασίας από κάποιον εργοδότη είτε κατά την διάρκεια ή μετά την ημερομηνία λήξης της συμμετοχής σας (ολοκλήρωση ή αποχώρηση) στο πρόγραμμα;' },
    { subCategory: 'E2.1', id: 'E2_1', name: 'E2_1', text: 'Αμέσως μετά την ολοκλήρωση του προγράμματος' },
    { subCategory: 'E2.2', id: 'E2_2', name: 'E2_2', text: 'Κατά τη διάρκεια του προγράμματος, δεν την αποδέχτηκα και συνέχισα το πρόγραμμα' },
    { subCategory: 'E2.3', id: 'E2_3', name: 'E2_3', text: 'Κατά τη διάρκεια του προγράμματος, την αποδέχτηκα και αποχώρησα από το πρόγραμμα' },
    { subCategory: 'E3', id: 'E3', name: 'E3', text: 'Έχετε λάβει προσφορά/πρόταση για συμμετοχή σας σε κάποιο άλλο πρόγραμμα «συνεχιζόμενης εκπαίδευσης», είτε κατά τη διάρκεια ή μετά την ημερομηνία λήξης της συμμετοχής σας (ολοκλήρωση ή αποχώρηση) σε αυτό το πρόγραμμα;' },
    { subCategory: 'E3.1', id: 'E3_1', name: 'E3_1', text: 'Αμέσως μετά την ολοκλήρωση του προγράμματος' },
    { subCategory: 'E3.2', id: 'E3_2', name: 'E3_2', text: 'Κατά τη διάρκεια του προγράμματος, δεν την αποδέχτηκα και συνέχισα το πρόγραμμα' },
    { subCategory: 'E3.3', id: 'E3_3', name: 'E3_3', text: 'Κατά τη διάρκεια του προγράμματος, την αποδέχτηκα και αποχώρησα από το πρόγραμμα' },
    { subCategory: 'E4', id: 'E4', name: 'E4', text: 'Έχετε λάβει προσφορά/πρόταση για θέση πρακτικής άσκησης (π.χ. για την απόκτηση άδειας ασκήσεως επαγγέλματος) είτε κατά τη διάρκεια ή μετά την ημερομηνία λήξης της συμμετοχής σας (ολοκλήρωση ή αποχώρηση) σε αυτό το πρόγραμμα;' },
    { subCategory: 'E4.1', id: 'E4_1', name: 'E4_1', text: 'Αμέσως μετά την ολοκλήρωση του προγράμματος' },
    { subCategory: 'E4.2', id: 'E4_2', name: 'E4_2', text: 'Κατά τη διάρκεια του προγράμματος, δεν την αποδέχτηκα και συνέχισα το πρόγραμμα' },
    { subCategory: 'E4.3', id: 'E4_3', name: 'E4_3', text: 'Κατά τη διάρκεια του προγράμματος, την αποδέχτηκα και αποχώρησα από το πρόγραμμα' },
    { subCategory: 'E5', id: 'E5', name: 'E5', text: 'Έχετε λάβει προσφορά/πρόταση για μαθητεία είτε κατά τη διάρκεια ή μετά την ημερομηνία λήξης της συμμετοχής σας (ολοκλήρωση ή αποχώρηση) σε αυτό το πρόγραμμα;' },
    { subCategory: 'E5.1', id: 'E5_1', name: 'E5_1', text: 'Αμέσως μετά την ολοκλήρωση του προγράμματος' },
    { subCategory: 'E5.2', id: 'E5_2', name: 'E5_2', text: 'Κατά τη διάρκεια του προγράμματος, δεν την αποδέχτηκα και συνέχισα το πρόγραμμα' },
    { subCategory: 'E5.3', id: 'E5_3', name: 'E5_3', text: 'Κατά τη διάρκεια του προγράμματος, την αποδέχτηκα και αποχώρησα από το πρόγραμμα' }
  ];

  public static internshipExperienceOutputSheetMIS2127 = [
    { subCategory: 'E1', id: 'E1', name: 'E1', text: 'Αποκτήθηκε εξειδίκευση/πιστοποίηση μετά από εξετάσεις που έχουν  πραγματοποιηθεί το διάστημα αμέσως μετά τη λήξη συμμετοχής του στην πράξη και έως τέσσερις (4) εβδομάδες μετά' },
  ]

}

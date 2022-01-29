import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  public data = [
    { serialNumber: '1', id: 'collapseOne', name: 'Τμήμα Οικονομικών Επιστημών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'http://es.uop.gr/el/', cardColor: 'card-primary'},
    { serialNumber: '2', id: 'collapseTwo', name: 'Τμήμα Πληροφορικής και Τηλεπικοινωνιών', address: 'Ακαδημαϊκού Γ. Κ. Βλάχου, 22131, Τρίπολη', phone: '2710230128, 2710230123', email: 'dit-secr@uop.gr', site: 'http://dit.uop.gr/', cardColor: 'card-primary' },
    { serialNumber: '3', id: 'collapseThree', name: 'Τμήμα Διοικητικής Επιστήμης και Τεχνολογίας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-primary' },
    { serialNumber: '4', id: 'collapseFour', name: 'Τμήμα Ψηφιακών Συστημάτων', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-primary mb-5' },
    { serialNumber: '5', id: 'collapseFive', name: 'Τμήμα Λογοθεραπείας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-success' },
    { serialNumber: '6', id: 'collapseSix', name: 'Τμήμα Επιστήμης Διατροφής και Διαιτολογίας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-success' },
    { serialNumber: '7', id: 'collapseSeven', name: 'Τμήμα Φυσικοθεραπείας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-success' },
    { serialNumber: '8', id: 'collapseEight', name: 'Τμήμα Νοσηλευτικής', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-success mb-5'},
    { serialNumber: '9', id: 'collapseNine', name: 'Τμήμα Ιστορίας, Αρχαιολογίας και Διαχείρισης Πολιτισμικών Αγαθών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-danger' },
    { serialNumber: '10', id: 'collapseTen', name: 'Τμήμα Φιλολογίας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-danger mb-5' },
    { serialNumber: '11', id: 'collapseEleven', name: 'Τμήμα Γεωπονίας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-secondary' },
    { serialNumber: '12', id: 'collapseTwelve', name: 'Τμήμα Επιστήμης και Τεχνολογίας Τροφίμων', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-secondary mb-5' },
    { serialNumber: '13', id: 'collapseThirteen', name: 'Τμήμα Λογιστικής και Χρηματοοικονομικής', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-warning' },
    { serialNumber: '14', id: 'collapseFourteen', name: 'Τμήμα Διοίκησης Επιχειρήσεων και Οργανισμών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-warning mb-5' },
    { serialNumber: '15', id: 'collapseFifteen', name: 'Τμήμα Κοινωνικής και Εκπαιδευτικής Πολιτικής', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-info' },
    { serialNumber: '16', id: 'collapseSixteen', name: 'Τμήμα Πολιτικής Επιστήμης και Διεθνών Σχέσεων', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-info mb-5' },
    { serialNumber: '17', id: 'collapseSeventeen', name: 'Τμήμα Θεατρικών Σπουδών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-primary' },
    { serialNumber: '18', id: 'collapseEighteen', name: 'Τμήμα Παραστατικών και Ψηφιακών Τεχνών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-primary mb-5' },
    { serialNumber: '19', id: 'collapseNineteen', name: 'Τμήμα Οργάνωσης και Διαχείρισης Αθλητισμού', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-success mb-5' },
    { serialNumber: '20', id: 'collapseTwenty', name: 'Τμήμα Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-warning' },
    { serialNumber: '21', id: 'collapseTwentyOne', name: 'Τμήμα Μηχανολόγων Μηχανικών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-warning'},
    { serialNumber: '22', id: 'collapseTwentyTwo', name: 'Τμήμα Πολιτικών Μηχανικών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'es.uop.gr', cardColor: 'card-warning' },
  ]
  ngOnInit(): void {
  }

}

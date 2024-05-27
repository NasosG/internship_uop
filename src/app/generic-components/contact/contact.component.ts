import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  public EconomicsTechnology = [
    { serialNumber: '1', id: 'collapseOne', name: 'Τμήμα Οικονομικών Επιστημών', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128, 2710230123', email: 'econ@uop.gr', site: 'http://es.uop.gr/el/', departmentManager: 'Δασκαλοπούλου Ειρήνη', email2: 'daskal@go.uop.gr', cardColor: 'card-primary' },
    { serialNumber: '2', id: 'collapseTwo', name: 'Τμήμα Πληροφορικής και Τηλεπικοινωνιών', address: 'Ακαδημαϊκού Γ. Κ. Βλάχου, 22131, Τρίπολη', phone: '2710372293, 2710372297', email: 'dit-secr@uop.gr', site: 'http://dit.uop.gr/', departmentManager: 'Πλατής Νικόλαος', email2: 'nplatis@go.uop.gr', cardColor: 'card-primary' },
    { serialNumber: '3', id: 'collapseThree', name: 'Τμήμα Διοικητικής Επιστήμης και Τεχνολογίας', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230128', email: 'det@uop.gr', site: 'https://det.uop.gr', departmentManager: 'Κακούρης Αλέξανδρος', email2: 'a.kakouris@go.uop.gr', cardColor: 'card-primary' },
    { serialNumber: '4', id: 'collapseFour', name: 'Τμήμα Ψηφιακών Συστημάτων', address: 'Κτήριο Βαλιώτη,  Περιοχή Κλαδά,.23100, Σπάρτη', phone: '2731082240, 2731082227', email: 'ds-secr@uop.gr', site: 'http://ds.uop.gr', departmentManager: 'Λιαπέρδος Ιωάννης', email2: 'i.liaperdos@go.uop.gr', cardColor: 'card-primary mb-5' },
  ]

  public HealthSciences = [
    { serialNumber: '5', id: 'collapseFive', name: 'Τμήμα Λογοθεραπείας', address: 'Αντικάλαμος 24100 Καλαμάτα', phone: '2721045320', email: 'gramlogo@uop.gr', site: 'http://slt.uop.gr/', departmentManager: 'Ευστρατιάδου Ευαγγελία - Αντωνία', email2: 'e.efstratiadou@go.uop.gr', cardColor: 'card-success' },
    { serialNumber: '6', id: 'collapseSix', name: 'Τμήμα Επιστήμης Διατροφής και Διαιτολογίας', address: 'Αντικάλαμος 24100 Καλαμάτα', phone: '2721045126, 2721045268', email: 'nds-secr@uop.gr', site: 'http://nds.uop.gr/', departmentManager: 'Γκιοξάρη Αριστέα', email2: 'a.gioxari@go.uop.gr', cardColor: 'card-success' },
    { serialNumber: '7', id: 'collapseSeven', name: 'Τμήμα Φυσικοθεραπείας', address: 'Λεωφόρος Ευσταθίου και Σταματικής Βαλιώτη και Πλαταιών, Σπάρτη,23100', phone: '2731089689, 2731089684', email: 'pthgram@uop.gr', site: 'http://physiotherapy.uop.gr/', departmentManager: 'Χρηστάκου Άννα', email2: 'a.christakou@go.uop.gr', cardColor: 'card-success' },
    { serialNumber: '8', id: 'collapseEight', name: 'Τμήμα Νοσηλευτικής', address: 'Θέση Σέχι – Πρώην 4ο Πεδίο Βολής 22100 Τρίπολη', phone: '2710230125', email: 'nrsgram@uop.gr', site: 'http://nosileftiki.uop.gr/', departmentManager: 'Παπαγεωργίου Δημήτριος', email2: 'dpapageorg@go.uop.gr', cardColor: 'card-success mb-5' },
  ]

  public HumanitiesCulturalStudies = [
    { serialNumber: '9', id: 'collapseNine', name: 'Τμήμα Ιστορίας, Αρχαιολογίας και Διαχείρισης Πολιτισμικών Αγαθών', address: 'Παλαιό Στρατόπεδο, Ανατολικό κέντρο, 24100 Καλαμάτα', phone: '2721065101, 2721065103, 2721065117', email: 'hamcc-secr@uop.gr', site: 'http://ham.uop.gr/el/', departmentManager: 'Χρήστου Αθανάσιος', email2: 'christou@go.uop.gr', cardColor: 'card-danger' },
    { serialNumber: '10', id: 'collapseTen', name: 'Τμήμα Φιλολογίας', address: 'Παλαιό Στρατόπεδο, Ανατολικό κέντρο, 24100 Καλαμάτα', phone: '2721065115, 2721065106', email: 'phil-secr@uop.gr', site: 'http://phil.uop.gr/', departmentManager: 'Καπετανάκη Σοφία', email2: 'kapetan@go.uop.gr', cardColor: 'card-danger mb-5' },
  ]

  public AgricultureFood = [
    { serialNumber: '11', id: 'collapseEleven', name: 'Τμήμα Γεωπονίας', address: 'Αντικάλαμος Μεσσηνιας 24100 Καλαμάτα', phone: '2721045234, 2721045135 ', email: 'agro-secr@uop.gr steg@teikal.gr', site: 'http://agro.uop.gr/index.php', departmentManager: 'Ξαπλαντέρη Μαρία', email2: 'm.xaplanteri@go.uop.gr', cardColor: 'card-secondary' },
    { serialNumber: '12', id: 'collapseTwelve', name: 'Τμήμα Επιστήμης και Τεχνολογίας Τροφίμων', address: 'Αντικάλαμος Μεσσηνίας 24100 Καλαμάτα', phone: '2721045132, 2721045134', email: 'Fst-secr@uop.gr', site: 'http://fst.uop.gr', departmentManager: 'Κουτρουμπής Φώτιος', email2: 'f.koutroumpis@go.uop.gr', cardColor: 'card-secondary mb-5' },
  ]

  public Management = [
    { serialNumber: '13', id: 'collapseThirteen', name: 'Τμήμα Λογιστικής και Χρηματοοικονομικής', address: 'Αντικάλαμος Μεσσηνίας 24100 Καλαμάτα', phone: '2721045151', email: 'chrime@us.uop.gr', site: 'http://accfin.uop.gr', departmentManager: 'Γιαννόπουλος Βασίλειος', email2: 'v.giannopoulos@go.uop.gr', cardColor: 'card-warning' },
    { serialNumber: '14', id: 'collapseFourteen', name: 'Τμήμα Διοίκησης Επιχειρήσεων και Οργανισμών', address: 'Αντικάλαμος Μεσσηνίας 24100 Καλαμάτα', phone: '2721045123', email: 'boa-secr@uop.gr', site: 'http://boa.uop.gr/', departmentManager: 'Νόκας Γεώργιος', email2: 'g.nokas@go.uop.gr', cardColor: 'card-warning mb-5' },
  ]

  public SocialPolitical = [
    { serialNumber: '15', id: 'collapseFifteen', name: 'Τμήμα Κοινωνικής και Εκπαιδευτικής Πολιτικής', address: 'Δαμασκηνού και Κολοκοτρώνη, ΤΚ20100 Κόρινθος', phone: '2741074991, 2741074993', email: 'sep-secr@uop.gr', site: 'http://dsep.uop.gr', departmentManager: 'Τσιωτάκης Παναγιώτης', email2: 'ptsiotakis@go.uop.gr', cardColor: 'card-info' },
    { serialNumber: '16', id: 'collapseSixteen', name: 'Τμήμα Πολιτικής Επιστήμης και Διεθνών Σχέσεων', address: 'Λεωφόρος Αθηνών & Αριστοτέλους 1, Τ.Κ. 20132, Κόρινθος', phone: '2741040040, 2741040045, 2741040058', email: 'pedis@uop.gr', site: 'http://pedis.uop.gr ', departmentManager: 'Παπάζογλου Εμμανουήλ', email2: 'epapaz@go.uop.gr', cardColor: 'card-info mb-5' },
  ]

  public Arts = [
    { serialNumber: '17', id: 'collapseSeventeen', name: 'Τμήμα Θεατρικών Σπουδών', address: 'Βασιλέως Κωνσταντίνου 21 & Τερζάκη, Ναύπλιο, 21 100.', phone: '2752096131, 2752096130', email: 'ts-secretary@uop.gr', site: 'http://ts.uop.gr', departmentManager: 'Βασιλάκου Αντωνία', email2: 'avasilak@go.uop.gr', cardColor: 'card-primary' },
    { serialNumber: '18', id: 'collapseEighteen', name: 'Τμήμα Παραστατικών και Ψηφιακών Τεχνών', address: 'Βασιλέως Κωνσταντίνου 21 & Τερζάκη, Ναύπλιο, 21 100.', phone: '2752096129, 2752096127', email: 'pda-secr@uop.gr', site: 'http://pda.uop.gr/', departmentManager: 'Ευκλείδης Αλέξανδρος', email2: 'efklidis@go.uop.gr', cardColor: 'card-primary mb-5' },
  ]

  public HumanMovementQualityLife = [
    { serialNumber: '19', id: 'collapseNineteen', name: 'Τμήμα Οργάνωσης και Διαχείρισης Αθλητισμού', address: 'Λεωφόρος Ευσταθίου και Σταματικής Βαλιώτη και Πλαταιών, 23100 Σπάρτη', phone: '2731089658, 2731089661, 2731089662', email: 'toda@go.uop.gr', site: 'http://sportmanagement.uop.gr/', departmentManager: 'Γδοντέλη Κρινάνθη', email2: 'ggeo@go.uop.gr', cardColor: 'card-success mb-5' },
  ]

  public Engineering = [
    { serialNumber: '20', id: 'collapseTwenty', name: 'Τμήμα Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών', address: 'Μεγάλου Αλεξάνδρου 1, 26334,Κουκούλι, Πάτρα', phone: '2610369236, 2610369237, 2610369193, 2610369263', email: 'secretary.ece@uop.gr', site: 'http://ece.uop.gr', departmentManager: 'Χαραλαμπάκος Βασίλειος-Νεκτάριος', email2: 'charalambakos@go.uop.gr', cardColor: 'card-warning' },
    { serialNumber: '21', id: 'collapseTwentyOne', name: 'Τμήμα Μηχανολόγων Μηχανικών', address: 'Μεγάλου Αλεξάνδρου 1, 26334,Κουκούλι, Πάτρα', phone: '2610369277, 2610369278, 2610369198', email: 'mech-secr@uop.gr', site: 'http://mech.uop.gr/', departmentManager: 'Τσίρκας Σωτήριος', email2: 'stsirkas@go.uop.gr', cardColor: 'card-warning' },
    { serialNumber: '22', id: 'collapseTwentyTwo', name: 'Τμήμα Πολιτικών Μηχανικών', address: 'Μεγάλου Αλεξάνδρου 1, 26334,Κουκούλι, Πάτρα', phone: '2610369279, 2610369280, 2610369199', email: 'civil-secr@uop.gr', site: 'http://civil.uop.gr', departmentManager: 'Φουρνιώτης Νικόλαος', email2: 'nfou@go.uop.gr', cardColor: 'card-warning' },
  ]

  public InternshipOffice = [
    { serialNumber: '23', id: 'collapseTwentyThree', name: 'Κεντρικό Γραφείο Πρακτικής Άσκησης - Τρίπολη (Αγγελοπούλου Αγγελική)', address: 'Πανεπιστήμιο Πελοποννήσου – Ακαδημαϊκού Γ.Κ. Βλάχου, 2ο κτίριο Ο.Α.Ε.Δ Τρίπολη Τ.Κ. 22131', email: 'aaggelop@go.uop.gr', departments: 'Πληροφορικής και Τηλεπικοινωνιών - Κοινωνικής και Εκπαιδευτικής Πολιτικής - Πολιτικής Επιστήμης και Διεθνών Σχέσεων - Οικονομικών Επιστημών - Διοικητικής Επιστήμης και Τεχνολογίας - Νοσηλευτική', cardColor: 'card-primary' },
    { serialNumber: '24', id: 'collapseTwentyFour', name: 'Γραφείο Πρακτικής Άσκησης - Καλαμάτα (Αποστολοπούλου Βασιλική)', address: 'Καλαμάτα - Αντικάλαμος Μεσσηνίας, 24100', email: 'v.apostolopoulou@go.uop.gr', departments: 'Ιστορίας Αρχαιολογίας και Διαχείρισης Πολιτισμικών Αγαθών - Γεωπονίας - Επιστήμης και Τεχνολογίας Τροφίμων - Διοίκησης Επιχειρήσεων και Οργανισμών - Επιστήμης Διατροφής και Διαιτολογίας - ΤΕΙ Διοίκησης Επιχειρήσεων και Οργανισμών -  ΤΕΙ Τεχνολόγων Γεωπόνων - ΤΕΙ Τεχνολογίας Τροφίμων', cardColor: 'card-primary' },
    { serialNumber: '25', id: 'collapseTwentyFive', name: 'Γραφείο Πρακτικής Άσκησης - Καλαμάτα (Χουντή Αρετή)', address: 'Καλαμάτα - Αντικάλαμος Μεσσηνίας, 24100', email: 'a.chounti@go.uop.gr', departments: 'Φιλολογίας - Λογιστικής και Χρηματοοικονομικής - Λογοθεραπείας - Ψηφιακών Συστημάτων - Φυσικοθεραπείας - ΤΕΙ Λογιστικής και Χρηματοοικονομικής - ΤΕΙ Λογοθεραπείας  - ΤΕΙ Μηχανικών Πληροφορικής', cardColor: 'card-primary' },
    { serialNumber: '26', id: 'collapseTwentySix', name: 'Γραφείο Πρακτικής Άσκησης - Πάτρα (Παπαγεωργίου Παναγιώτα)', address: ' Μεγάλου Αλεξάνδρου 1, Κουκούλι, Τ.Κ. 26334, Πάτρα', email: 'p.papageorgiou@go.uop.gr', departments: 'Θεατρικών Σπουδών - Οργάνωσης και Διαχείρισης Αθλητισμού - Παραστατικών και Ψηφιακών Τεχνών - Ηλεκτρολόγων Μηχανικών και Μηχανικών Υπολογιστών - Μηχανολόγων Μηχανικών - Πολιτικών Μηχανικών - ΤΕΙ Ηλεκτρολόγων Μηχανικών ΤΕ - ΤΕΙ Μηχανικών Πληροφορικής ΤΕ - ΤΕΙ Μηχανολόγων Μηχανικών ΤΕ - ΤΕΙ Πολιτικών Μηχανικών ΤΕ', cardColor: 'card-primary' },
  ]

  public ItSupport = [
    { serialNumber: '27', id: 'collapseTwentySeven', name: 'Κωνσταντόπουλος Αθανάσιος', address: 'Πανεπιστήμιο Πελοποννήσου – Ακαδημαϊκού Γ.Κ. Βλάχου, 2ο κτίριο Ο.Α.Ε.Δ Τρίπολη Τ.Κ. 22131', email: 'a.konstantopoulos@go.uop.gr', cardColor: 'card-primary' },
  ]

  public Atlas = [
    { serialNumber: '28', id: 'collapseTwentyEight', name: 'Άτλας', site: 'https://atlas.grnet.gr/contact', cardColor: 'card-primary' },
  ]

  public DepartmentManager = [
    { serialNumber: '29', id: 'collapseTwentyNine', name: 'Γιαννόπουλος Κωνσταντίνος', position: 'Αναπληρωτής Καθηγητής του Τμήματος Πληροφορικής και Τηλεπικοινωνιών', email: 'kyianno@go.uop.gr', cardColor: 'card-primary' },
  ]

  ngOnInit(): void {

  }

}

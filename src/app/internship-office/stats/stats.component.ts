import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/MiscUtils';
import * as XLSX from 'xlsx';
import {OfficeService} from '../office.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  years: number[] = [2021, 2022, 2023];
  dummyYears: number[] = [2022];
  selectedYear!: number;
  selectedYear2!: number;
  selectedYearAcc!: number;
  selectedYearAcc2!: number;
  selectedDepartment!: string;

  constructor(private officeService: OfficeService) { }

  ngOnInit(): void { }

  exportToExcel(selectedYearValue: number) {
    // console.log(selectedYearValue);
    this.officeService.getAchievementsStats()
      .subscribe((res: any) => {
        let cnt: number = 0;
        let finalRow;

        let statsDataJson: any = [];
        for (const item of res) {
          const itemIndex = res.indexOf(item);
          cnt += Number(item.completed_count);
          if (itemIndex == (res.length - 1)) {
            finalRow = {"ΣΥΝΟΛΟ": cnt}
          }

          statsDataJson.push({
            "Α/Α": itemIndex + 1,
            "ΕΤΟΣ": item.year,
            "ΤΜΗΜΑ": item.department,
            "ΘΕΣΕΙΣ ΠΑ": Number(item.total_count),
            "ΑΝΤΡΕΣ": Number(item.male_count),
            "ΓΥΝΑΙΚΕΣ": Number(item.female_count),
            "ΟΛΟΚΛΗΡΩΜΕΝΕΣ": Number(item.completed_count)
          });
        }

        const excelFileName: string = "achievement_indicators.xlsx";
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(statsDataJson);
        XLSX.utils.sheet_add_json(ws, [finalRow],  { origin: { r: -1, c: 6 }});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'ΣΥΝΟΛΟ');

        /* Save to file */
        XLSX.writeFile(wb, excelFileName);
      });
  }

  exportStudentsStatsToExcel() {
    this.officeService.getAchievementsStatsForStudents()
      .subscribe((res: any) => {
        const excelFileName: string = "internship_assignment_data.xlsx";

        // Map the response data to the desired format for Excel
        const dataForExcel = res.map((item: any, index: number) => {
          console.log(item);

          const genderValue = item.student_gender === 1 ? 10 : item.student_gender === 2 ? 20 : null;

          return {
            "Α/Α": index + 1,
            "ΕΤΑΙΡΙΑ": item.asgmt_company_name,
            "Δ/Ι": '',
            "ΦΟΙΤΗΤΗΣ": item.student_name,
            "ΦΥΛΟ": genderValue
          };
        });

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Internship Assignment Data');

        // Save to file
        XLSX.writeFile(wb, excelFileName);
      });
}

  exportToExcelAcc(selectedYearValue: number) {
    // this.studentsService.getStudentsCountByYearAndDepartment(selectedYearValue, 'accommodation')
    //   .subscribe((res: any) => {
    //     let cnt: number = 0;
    //     let finalRow;

    //     let statsDataJson: any = [];
    //     for (const item of res) {
    //       const itemIndex = res.indexOf(item);
    //       if (itemIndex == (res.length - 1)) {
    //         finalRow = {"ΣΥΝΟΛΟ": cnt}
    //       }
    //       cnt++;
    //       statsDataJson.push({
    //         "Α/Α": itemIndex + 1,
    //         "ΕΤΟΣ": item.acyear,
    //         "ΤΜΗΜΑ": this.getDepartmentNameById(Number(res['department_id'])),
    //         "ΟΛΑ": Number(item.all_results),
    //         "ΔΙΚΑΙΟΥΧΟΙ": Number(item.pass),
    //         "ΑΠΟΡΡΙΠΤΟΜΕΝΟΙ": Number(item.fail)
    //       });
    //     }

    //     const excelFileName: string = "StudentsPhase1Accommodation.xlsx";
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(statsDataJson);
    //     XLSX.utils.sheet_add_json(ws, [finalRow],  { origin: { r: -1, c: 4 }});
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'ΣΥΝΟΛΟ');

    //     /* Save to file */
    //     XLSX.writeFile(wb, excelFileName);
    //   });
  }

  async exportToGenericExcel(selectedYearValue: number, type: 'meals' | 'acc') {
    // this.studentsService.getStudentAppsByYear(selectedYearValue, type)
    //   .subscribe((res: any) => {
    //     let studentsDataJson: any = [];

    //     for (const item of res) {

    //       const itemIndex = res.indexOf(item);

    //       const studentData = {
    //         "Α/Α": itemIndex + 1,
    //         "ΚΑΤΗΓΟΡΙΑ": item.application_files?.length > 0 ? "1" : "2",
    //         "TMHMA": this.getDepartmentNameById(Number(item.department_id)),
    //         // "ΑΡΙΘΜΟΣ ΜΗΤΡΩΟΥ": Utils.getRegistrationNumber(item.schacpersonaluniquecode),
    //         "ΕΠΩΝΥΜΟ": item.sn,
    //         "ΟΝΟΜΑ": item.givenname,
    //         "ΠΑΤΡΩΝΥΜΟ": item.father_name,
    //         "ΑΡΙΘΜΟΣ ΑΙΤΗΣΗΣ": item.app_id,
    //         "ΗΜΕΡΟΜΗΝΙΑ ΑΙΤΗΣΗΣ": Utils.getPreferredTimestamp(item.submit_date),
    //         "E-MAIL": item.mail,
    //         "ΗM/NIA ΓΕΝΝΗΣΗΣ": Utils.reformatDateOfBirth(item.schacdateofbirth),
    //         "ΤΗΛΕΦΩΝΟ": item.phone,
    //         "ΠΟΛΗ": item.city,
    //         "ΤΚ": item.post_address,
    //         "ΔΙΕΥΘΥΝΣΗ": item.address,
    //         "ΤΟΠΟΘΕΣΙΑ": item.location,
    //         // "ΚΑΤΗΓΟΡΙΑ": item.category,
    //         "ΟΙΚΟΓΕΝΕΙΑΚΟ ΕΙΣΟΔΗΜΑ": item.family_income,
    //         // "ΟΡΙΟ ΕΙΣΟΔΗΜΑΤΟΣ": this.calculateIncomeLimitForStudent(item),
    //         "ΟΙΚΟΓΕΝΕΙΑΚΗ ΚΑΤΑΣΤΑΣΗ": item.family_state,
    //         "ΠΡΟΣΤΑΤΕΥΟΜΕΝΑ ΜΕΛΗ": item.protected_members,
    //         "ΑΔΕΛΦΙΑ ΠΟΥ ΦΟΙΤΟΥΝ": item.siblings_students,
    //         "ΠΑΙΔΙΑ ΦΟΙΤΗΤΗ": item.children,
    //         "ΠΟΛΥΤΕΚΝΕΙΑ": item.application_files?.includes('filePolutekneia') ? 'ΝΑΙ' : 'ΟΧΙ',
    //         "ΤΡΙΤΕΚΝΟΣ Η ΦΟΙΤΗΤΗΤΣ ΓΟΝΕΑΣ": item.application_files?.includes('pistopoihtikoGoneaFoithth') ? 'ΝΑΙ' : 'OXI',
    //         "ΑΔΕΡΦΙΑ ΦΟΙΤΗΤΕΣ": item.application_files?.includes('bebaioshSpoudonAderfwn') ? 'ΝΑΙ' : 'OXI',
    //         "ΑΓΑΜΗ ΜΗΤΕΡΑ": item.application_files?.includes('agamhMhtera') ? 'ΝΑΙ' : 'OXI',
    //         "ΑΠΟΘΝΗΣΚΩΝ ΓΟΝΕΑΣ": item.application_files?.includes('lhksiarxikhPrakshThanatouGoneaA') || item.application_files?.includes('lhksiarxikhPrakshThanatouGoneaB') ? 'ΝΑΙ' : 'OXI',
    //         "ΓΟΝΕΙΣ ΑΜΕΑ": item.application_files?.includes('goneisAMEA') || item.application_files?.includes('goneisAMEAIatrikhGnomateush') ? 'ΝΑΙ' : 'OXI',
    //         "ΓΟΝΕΙΣ ΘΥΜΑΤΑ ΤΡΟΜΟΚΡΑΤΙΑΣ": item.application_files?.includes('goneisThumataTromokratias1') || item.application_files?.includes('goneisThumataTromokratias2') ? 'ΝΑΙ' : 'OXI',
    //         "ΑΝΕΡΓΟΣ/Η": item.application_files?.includes('bebaioshEpidothsdhsAnergeias') ? 'ΝΑΙ' : 'OXI',
    //         "ΔΙΑΓΕΥΓΜΕΝΟΙ ΓΟΝΕΙΣ": item.application_files?.includes('diazevgmenoiGoneis1') || item.application_files?.includes('diazevgmenoiGoneis2') ? 'ΝΑΙ' : 'OXI',
    //         "ΦΟΙΤΗΤΗΣ / ΡΙΑ ΑΜΕΑ": item.application_files?.includes('AMEA') || item.application_files?.includes('AMEAIatrikhGnomateush') ? 'ΝΑΙ' : 'OXI'
    //       };
    //       studentsDataJson.push(studentData);
    //     }
    //     const excelFileName: string = "εξαγωγή γενικής λίστας.xlsx";
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(studentsDataJson);
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    //     /* Save to file */
    //     XLSX.writeFile(wb, excelFileName);
      // });
  }

  // calculateIncomeLimitForStudent(item: any) {
  //   return Utils.calculateIncomeLimitForMealEligibility(item);
  // }

  getDepartmentNameById(depId: number) {
    const deptIdStr: string = depId.toString();
    return this.departmentsMap[deptIdStr];
  }

  public departmentsMap: { [key: string]: string } = {
    '98': 'ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΤΗΛΕΠΙΚΟΙΝΩΝΙΩΝ',
    '104': 'ΙΣΤΟΡΙΑΣ, ΑΡΧΑΙΟΛΟΓΙΑΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΠΟΛΙΤΙΣΜΙΚΩΝ ΑΓΑΘΩΝ',
    '1511': 'ΓΕΩΠΟΝΙΑΣ',
    '1512': 'ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ ΤΡΟΦΙΜΩΝ',
    '1513': 'ΛΟΓΙΣΤΙΚΗΣ ΚΑΙ ΧΡΗΜΑΤΟΟΙΚΟΝΟΜΙΚΗΣ',
    '1514': 'ΔΙΟΙΚΗΣΗΣ ΕΠΙΧΕΙΡΗΣΕΩΝ ΚΑΙ ΟΡΓΑΝΙΣΜΩΝ',
    '1515': 'ΛΟΓΟΘΕΡΑΠΕΙΑΣ',
    '1516': 'ΕΠΙΣΤΗΜΗΣ ΔΙΑΤΡΟΦΗΣ ΚΑΙ ΔΙΑΙΤΟΛΟΓΙΑΣ',
    '1517': 'ΠΑΡΑΣΤΑΤΙΚΩΝ ΚΑΙ ΨΗΦΙΑΚΩΝ ΤΕΧΝΩΝ',
    '1518': 'ΔΙΟΙΚΗΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΤΕΧΝΟΛΟΓΙΑΣ',
    '1519': 'ΨΗΦΙΑΚΩΝ ΣΥΣΤΗΜΑΤΩΝ',
    '1520': 'ΦΥΣΙΚΟΘΕΡΑΠΕΙΑΣ',
    '1522': 'ΗΛΕΚΤΡΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ ΚΑΙ ΜΗΧΑΝΙΚΩΝ ΥΠΟΛΟΓΙΣΤΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '1523': 'ΜΗΧΑΝΟΛΟΓΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '1524': 'ΠΟΛΙΤΙΚΩΝ ΜΗΧΑΝΙΚΩΝ - ΣΧΟΛΗ ΜΗΧΑΝΙΚΩΝ',
    '187': 'ΚΟΙΝΩΝΙΚΗΣ ΚΑΙ ΕΚΠΑΙΔΕΥΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ',
    '189': 'ΦΙΛΟΛΟΓΙΑΣ',
    '190': 'ΝΟΣΗΛΕΥΤΙΚΗΣ',
    '361': 'ΟΙΚΟΝΟΜΙΚΩΝ ΕΠΙΣΤΗΜΩΝ',
    '362': 'ΘΕΑΤΡΙΚΩΝ ΣΠΟΥΔΩΝ',
    '400': 'ΟΡΓΑΝΩΣΗΣ ΚΑΙ ΔΙΑΧΕΙΡΙΣΗΣ ΑΘΛΗΤΙΣΜΟΥ',
    '411': 'ΠΟΛΙΤΙΚΗΣ ΕΠΙΣΤΗΜΗΣ ΚΑΙ ΔΙΕΘΝΩΝ ΣΧΕΣΕΩΝ'
  }
}

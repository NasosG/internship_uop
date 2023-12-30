import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { OfficeService } from '../office.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  years: number[] = [2021, 2022, 2023];
  internshipYears: number[] = [];
  selectedYear!: number;
  selectedYear2!: number;
  selectedYearAcc!: number;
  selectedYearAcc2!: number;
  selectedDepartment!: string;

  constructor(private officeService: OfficeService) { }

  ngOnInit(): void {
    this.loadInternshipYears();
  }

  loadInternshipYears() {
    const startYear = 2022;
    const currentYear = new Date().getFullYear();

    for (let year = startYear; year <= currentYear; year++) {
      this.internshipYears.push(year);
    }
    // Optionally, we can set a default selected year - not currently needed
    //this.selectedYearAcc = this.dummyYears[0];
  }

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
        const excelFileName: string = "assignment_data_students.xlsx";
        let i: number = 0;
        let menCount: number = 0;
        let womenCount: number = 0;

        let menPublicCount: number = 0;
        let womenPublicCount: number = 0;
        let menPrivateCount: number = 0;
        let womenPrivateCount: number = 0;

        let publicBussinessesCount: number = 0;
        let privateBussinessesCount: number = 0;
        // Flag to track the gender
        let isGender = 0;

        // Map the response data to the desired format for Excel
        const dataForExcel = res.map((item: any, index: number) => {
          console.log(item);
          i = index;
          const genderValue = item.student_gender === 1 ? 10 : item.student_gender === 2 ? 20 : null;

          // Count men and women
          if (genderValue === 10) {
            menCount++;
            isGender = 10;
          } else if (genderValue === 20) {
            womenCount++;
            isGender = 20;
          }

          // Determine the value for Δ/Ι based on company_name
          const publicCompanyKeywords = ['Γ.Ν', 'Γ.Ν.Ε', 'ΓΝΕ', 'Γ.Ν.Α', 'ΓΝΑ', 'ΔΗΜΟΣ', 'ΔΗΜΟΥ', 'ΠΕΡΙΦΕΡΕΙΑ', 'ΓΕΝΙΚΟ ΝΟΣΟΚΟΜΕΙΟ', 'ΠΓΝ', 'ΓΕΝΙΚΟ ΛΥΚΕΙΟ', 'ΑΝΕΞΑΡΤΗΤΗ ΑΡΧΗ', 'ΕΘΝΙΚΟ', 'ΔΙΕΥΘΥΝΣΗ', 'ΒΟΥΛΗ ', 'ΒΟΥΛΗΣ ', 'ΔΗΜΟΤΙΚΟ', 'ΔΗΜΟΤΙΚΗ', 'ΥΠΟΥΡΓΕ', 'Υπουργείο', 'ΔΗΜ.', 'ΠΟΛΕΜΙΚΟ ΜΟΥΣΕΙΟ', 'Εφορεία Αρχαιοτήτων', 'ΕΦΟΡΕΙΑ', 'ΟΛΥΜΠΙΑΚΟ ΑΘΛΗΤΙΚΟ ΚΕΝΤΡΟ', 'ΙΝΣΤΙΤΟΥΤΟ ΠΛΗΡΟΦΟΡΙΚΗΣ', 'ΠΑΝΕΠΙΣΤΗΜΙΟ', 'ΠΑΝΕΠΙΣΤΗΜΙΑΚΟ ΝΟΣΟΚΟΜΕΙΟ', 'ΘΕΑΓΕΝΕΙΟ', 'ΒΕΝΙΖΕΛΕΙΟ', 'ΤΖΑΝΕΙΟ', 'ΚΟΡΓΙΑΛΕΝΕΙΟ', 'ΜΠΕΝΑΚΕΙΟ', 'Ε.Ε.Σ', 'Ν.Π.Δ.Δ.', 'ΕΠΙΜΕΛΗΤΗΡΙΟ', 'Επιμελητήριο', 'ΠΡΑΣΙΝΟ ΤΑΜΕΙΟ', 'ΚΡΑΤΙΚΟ ΘΕΑΤΡΟ', 'ΚΚΠΠΑ-ΠΠΠΑ ', 'ΕΘΝΙΚΗ ΛΥΡΙΚΗ ΣΚΗΝΗ'];
          const isPublicCompany = publicCompanyKeywords
                                  .some(keyword => item.asgmt_company_name
                                  .includes(keyword));

          const isSpecialPublicCase = item.asgmt_company_name.includes('ΓΕΝΙΚΟ') && item.asgmt_company_name.includes('ΝΟΣΟΚΟΜΕΙΟ') ||
            item.asgmt_company_name.includes('ΓΕΝΙΚΟ') && item.asgmt_company_name.includes('ΛΥΚΕΙΟ');

          const deltaColumnValue = isPublicCompany || isSpecialPublicCase ? 0 : 1;
          publicBussinessesCount += deltaColumnValue === 0 ? 1 : 0;
          privateBussinessesCount += deltaColumnValue === 1 ? 1 : 0;

          menPublicCount += deltaColumnValue === 0 && isGender == 10 ? 1 : 0;
          womenPublicCount+= deltaColumnValue === 0 && isGender == 20 ? 1 : 0;
          menPrivateCount += deltaColumnValue === 1 && isGender == 10 ? 1 : 0;
          womenPrivateCount += deltaColumnValue === 1 && isGender == 20 ? 1 : 0;

          return {
            "Α/Α": index + 1,
            "ΕΤΑΙΡΙΑ": item.asgmt_company_name,
            "Δ/Ι": deltaColumnValue,
            "ΦΟΙΤΗΤΗΣ": item.student_name,
            "ΦΥΛΟ": genderValue
          };
        });

        let menWomenCountRow: any = {
          "ΑΝΔΡΕΣ": menCount,
          "ΓΥΝΑΙΚΕΣ": womenCount
        };

        let publicPrivateRow: any = {
          "ΔΗΜΟΣΙΕΣ": publicBussinessesCount,
          "ΙΔΙΩΤΙΚΕΣ": privateBussinessesCount
        };

        let menWomenInCompaniesRow: any = {
          "ΑΝΑ ΦΥΛΟ ΔΗΜ.": `Α: ${menPublicCount}, Γ: ${womenPublicCount}`,
          "ΑΝΑ ΦΥΛΟ ΙΔ.": `Α: ${menPrivateCount}, Γ: ${womenPrivateCount}`
        };

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataForExcel);
        XLSX.utils.sheet_add_json(ws, [menWomenCountRow],  { origin: { r: -1, c: 4 }});
        XLSX.utils.sheet_add_json(ws, [publicPrivateRow],  { origin: { r: -1, c: 2 }});
        XLSX.utils.sheet_add_json(ws, [menWomenInCompaniesRow],  { origin: { r: -1, c: 2 }});
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, excelFileName);

        // Save to file
        XLSX.writeFile(wb, excelFileName);
      });
  }

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

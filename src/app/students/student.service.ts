import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { EntryForm } from "./entry-form.model";
import { ExitForm } from "./exit-form.model";
import { EvaluationForm } from "./evaluation-form.model";
import { StudentPositions } from "./student-positions.model";
import { Application } from "./application.model";
import { AtlasPosition } from "./atlas-position.model";
import { Department } from "./department.model";
import { Prefecture } from "./prefecture.model";
import { City } from "./city.model";
import { Period } from "../department-managers/period.model";
import { Country } from "./country.model";
import { PhysicalObject } from "./physical-object.model";
import { environment } from "src/environments/environment";
import { Assignment } from "../companies/assignment.model";
import { ActiveApplicationsRanked } from "../companies/active-applications-ranked.model";
import { AcceptedAssignmentsByCompany } from "./accepted-assignments-by-company";

const STUDENTS_URL = environment.apiUrl + "/students/";
const ATLAS_URL = environment.apiUrl + "/atlas/";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public period!: Period;
  public fetchedStudentsObservable!: Observable<Array<Student>>;
  // private studentsUpdated = new Subject<Student[]>();
  public fetchedPeriodObservable!: Observable<Period>;
  constructor(private http: HttpClient, public authService: AuthService) { }

  // getStudentUpdateListener() {
  //   return this.studentsUpdated.asObservable();
  // }

  getStudentByIdFromDialog(id: number): Observable<Array<Student>> {
    return this.http.get<Array<Student>>(STUDENTS_URL + 'getStudentById/' + id);
  }

  getStudents(): Observable<Array<Student>> {
    let id = this.authService.getSessionId();
    const fetchedStudents = this.http.get<Array<Student>>(STUDENTS_URL + 'getStudentById/' + id);
    this.fetchedStudentsObservable = fetchedStudents;
    this.fetchedStudentsObservable.subscribe((students: Student[]) => {
      this.students = [...students];
    });
    return fetchedStudents;

    // .subscribe(postData => {
    //   this.students = postData;
    //   console.log(postData);
    //   this.studentsUpdated.next([...this.students]);
    // });
  }

  getFetchedPeriodObservable(): Observable<Period> {
    return this.fetchedPeriodObservable;
  }

  getStudentEntrySheets(): Observable<Array<EntryForm>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<EntryForm>>(STUDENTS_URL + 'getStudentEntrySheets/' + studentId);
  }

  getStudentExitSheets(): Observable<Array<ExitForm>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<ExitForm>>(STUDENTS_URL + 'getStudentExitSheets/' + studentId);
  }

  getStudentEvaluationSheets(): Observable<Array<EvaluationForm>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<EvaluationForm>>(STUDENTS_URL + 'getStudentEvaluationSheets/' + studentId);
  }

  getStudentPositions(): Observable<Array<StudentPositions>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<StudentPositions>>(STUDENTS_URL + 'getStudentPositions/' + studentId);
  }

  getStudentApplications(): Observable<Array<Application>> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<Array<Application>>(STUDENTS_URL + 'getStudentApplications/' + studentId);
  }

  // get active application
  getStudentActiveApplication(): Observable<number> {
    const studentId = this.authService.getSessionId();
    console.log("of user: " + this.authService.getSessionId());
    return this.http
      .get<number>(STUDENTS_URL + 'getStudentActiveApplication/' + studentId);
  }

  getAtlasPositions(begin: number): Observable<Array<AtlasPosition>> {
    return this.http
      .get<Array<AtlasPosition>>(ATLAS_URL + 'getAvailablePositionGroups/' + begin);
  }

  getAtlasFilteredPositions(begin: number, filterArray: any): Observable<Array<AtlasPosition>> {
    let filterData = JSON.parse(JSON.stringify(filterArray));
    return this.http
      .post<Array<AtlasPosition>>(ATLAS_URL + 'getAtlasFilteredPositions/' + begin, filterData);
  }

  getAtlasInstitutions(): Observable<Array<Department>> {
    return this.http
      .get<Array<Department>>(ATLAS_URL + 'getInstitutions/');
  }

  getAtlasAEIInstitutions(): Observable<Array<Department>> {
    return this.http
      .get<Array<Department>>(ATLAS_URL + 'getAEIInstitutions/');
  }

  getAtlasCities(): Observable<Array<City>> {
    return this.http.get<Array<City>>(ATLAS_URL + 'getCities/');
  }

  getAtlasPrefectures(): Observable<Array<City>> {
    return this.http.get<Array<City>>(ATLAS_URL + 'getPrefectures/');
  }

  getAtlasCountries(): Observable<Array<Country>> {
    return this.http.get<Array<Country>>(ATLAS_URL + 'getCountries/');
  }

  getAtlasPhysicalObjects(): Observable<Array<PhysicalObject>> {
    return this.http.get<Array<PhysicalObject>>(ATLAS_URL + 'getPhysicalObjects/');
  }


  getPhase(departmentId: number): Observable<Period> {
    // fetchedPeriodObservable
    const fetchedPeriod = this.http.get<Period>(STUDENTS_URL + 'getPhase/' + departmentId);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
    // return this.http.get<Period>(STUDENTS_URL + 'getPhase/' + departmentId);
  }

  getPeriod(): any {
    if (!this.period) return null;
    return this.period;
  }

  getGenericPositionSearch(begin: number, text: any): Observable<Array<AtlasPosition>> {
    const params = new HttpParams()
      .set('text', text)
      .set('begin', begin);
    return this.http
      .get<Array<AtlasPosition>>(ATLAS_URL + 'getGenericPositionSearch/', { params });
  }

  // public fetchStudentsAndPeriod() {
  //   let studentPeriodArray: any;
  //   let fetchedStudents: any[];
  //   let fetchedPeriod;
  //     this.getStudents()
  //     .subscribe((students: Student[]) => {
  //       fetchedStudents = students;
  //        this.getPhase(fetchedStudents[0]?.department_id)
  //         .subscribe((period: Period) => {
    //           fetchedPeriod = period;
    //           studentPeriodArray = Object.assign({"student" : fetchedStudents}, {"period": period});
    //           console.log("asd" + studentPeriodArray["period"].date_from);
    //           this.period =  studentPeriodArray["period"];
    //           console.log( "asd" + this.period.date_from);
    //           return this.period;
    //         });
  //     });
  // }
  public fetchStudentsAndPeriod(): Observable<Period> {
    let studentPeriodArray: any;
    let fetchedStudents: any[];
    let fetchedPeriod;
    const period = this.getStudents()
    .pipe(
      mergeMap(result => this.getPhase(result[0]?.department_id))
    )
    return period;
  }

  getCommentByStudentIdAndSubject(studentId: number, subject: string): Observable<any> {
    const params = new HttpParams()
    .set('studentId', studentId)
    .set('subject', subject);
    const fetchedComment = this.http.get<any>(STUDENTS_URL + "getCommentByStudentIdAndSubject/", { params });
    return fetchedComment;
  }

  checkUserAcceptance(): Observable<{message: string, accepted: boolean}> {
    const studentId = this.authService.getSessionId();
    return this.http
      .get<{ message: string; accepted: boolean }>(STUDENTS_URL + "checkUserAcceptance/" + studentId);
  }

  // this functions adds a new bio and details to a student
  updateStudentDetails(data: any) {
    const id = this.authService.getSessionId();
    // const student: string = modelStudent;
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
        // this.students.push(student);
        // this.studentsUpdated.next([...this.students]);
      });
  }

  updateStudentContractDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentContractDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContractSSNFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentSSNFile/" + id, file);
    // .subscribe(responseData => {
    // console.log("ssn " + responseData.message);
    // return responseData.message;
    // });
  }

  // Not so much needed as updateStudentFile exists, but changes to prod may create problems
  updateStudentContractFile(file: any, type: string): any {
    const id = this.authService.getSessionId();
    if (type == 'AMA')
      return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentSSNFile/" + id, file);
    else if (type == 'POLICEID')
     return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentIbanFile/" + id, file);
  }

  updateStudentFile(file: any, type: string): any {
    const id = this.authService.getSessionId();
    if (type == 'SSN')
      return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentSSNFile/" + id, file);
    else if (type == 'IBAN')
     return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentIbanFile/" + id, file);
    else if (type == 'AMEA')
      return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentAMEAFile/" + id, file);
    else if (type == 'AFFIDAVIT')
      return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentAffidavitFile/" + id, file);
  }

  updateStudentContractIbanFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentIbanFile/" + id, file);
  }

  updateStudentΑΜΕΑFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentAMEAFile/" + id, file);
  }

  updateStudentBio(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentBio/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContact(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentContact/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentSpecialDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentSpecialDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentEntrySheet(data: any) {
    const studentId = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentEntrySheet/" + studentId, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentEntrySheet(inputForm: any) {
    const studentId = this.authService.getSessionId();
    const form: EntryForm = inputForm;
    // console.log(inputForm);
    this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentEntrySheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentExitSheet(exitForm: any) {
    const studentId = this.authService.getSessionId();
    const form: ExitForm = exitForm;
    this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentExitSheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentEvaluationSheet(evaluationForm: any) {
    const studentId = this.authService.getSessionId();
    const form: EvaluationForm = evaluationForm;
    this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentEvaluationSheet/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentApplication(positions: StudentPositions[]) {
    const studentId = this.authService.getSessionId();
    this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentApplication/" + studentId, positions)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertStudentPosition(positionId: number, atlas: boolean) {
    const studentId = this.authService.getSessionId();
    if (atlas)
      return this.http
        .post<{ message: string }>(STUDENTS_URL + "insertStudentPosition/" + studentId, { positionId });
    else
      return this.http
        .post<{ message: string }>(STUDENTS_URL + "insertStudentPosition/" + studentId, { 'internal_position_id': positionId });
  }

  insertStudentTermsAcceptance(areTermsAccepted: boolean): Observable<any> {
    const studentId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "/insertUserAcceptance/" + studentId, { areTermsAccepted });
  }

  insertOrUpdateDepartmentDetails(data: any) {
    const id = this.authService.getSessionId();

    this.http
      .post<{ message: string }>(STUDENTS_URL + "addDepartmentDetails/" + id, { data })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  // Not currently used
  // deleteStudentPosition(positionPriority: number) {
  //   this.http
  //     .delete<{ message: string }>(STUDENTS_URL + "deletePositionByStudentId/" + positionPriority)
  //     .subscribe(responseData => {
  //       console.log(responseData.message);
  //     });
  // }

  deleteStudentPositions(studentId: number) {
    this.http
      .delete<{ message: string }>(STUDENTS_URL + "deletePositionsByStudentId/" + studentId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  deleteApplicationById(applicationId: number) {
    this.http
      .delete<{ message: string }>(STUDENTS_URL + "deleteApplicationById/" + applicationId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentPositionPriorities(positionPriority: number) {
    let id = this.authService.getSessionId();
    const form: any = { 'priority': positionPriority, 'student_id': id };
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentPositionPriorities/" + positionPriority, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentPositions(positionsArray: Array<StudentPositions>) {
    const studentId = this.authService.getSessionId();
    const form: Array<StudentPositions> = positionsArray;
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentPositions/" + studentId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updatePhase(phase: number) {
    const studentId = this.authService.getSessionId();
    const phaseJson: any = { 'phase': phase };
    console.log("phase " + phaseJson);
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updatePhase/" + studentId, phaseJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  // get assignments by student id
  getAssignmentsByStudentId(): Observable<Array<AcceptedAssignmentsByCompany>> {
    const studentId = this.authService.getSessionId();
    return this.http.get<Array<AcceptedAssignmentsByCompany>>(STUDENTS_URL + "getAssignmentsByStudentId/" + studentId);
  }

  acceptCompanyPosition(assignment: AcceptedAssignmentsByCompany) {
    const studentId = this.authService.getSessionId();
    const form: any = { 'assignment': assignment };
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "insertAssignment/" + studentId, form);
  }

  createStudentInterestApp(periodId: number) {
    const studentId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentInterestApp/" + studentId, { periodId })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  getMergedDepartmentInfoByStudentId(): Observable<Array<Department>> {
    const studentId = this.authService.getSessionId();
    return this.http.get<Array<Department>>(STUDENTS_URL + "getMergedDepartmentInfoByStudentId/" + studentId);
  }

  updateStudentDepartmentId(departmentId: number): Observable<any> {
    const studentId = this.authService.getSessionId();
    return this.http
      .patch<any>(STUDENTS_URL + "updateDepartmentIdByStudentId/" + studentId, { departmentId });
  }

  getProtocolNumberIfInterestAppExists(periodId: number): Observable<any> {
    const studentId = this.authService.getSessionId();
    const params = new HttpParams()
         .set('studentId', studentId)
         .set('periodId', periodId);
    return this.http.get<any>(STUDENTS_URL + "getProtocolNumberIfInterestAppExists/", { params });
  }

  getStudentRankedApprovalStatusForPeriod(periodId: number): Observable<boolean> {
    const studentId = this.authService.getSessionId();
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('periodId', periodId);

    return this.http.get<boolean>(STUDENTS_URL + "getStudentRankedApprovalStatusForPeriod", { params });
  }

  getStudentPositionMatchesAcademic(positionId: number, academicId: number): Observable<boolean> {
    const params = new HttpParams()
      .set('positionId', positionId)
      .set('academicId', academicId);

    return this.http.get<boolean>(ATLAS_URL + "getStudentPositionMatchesAcademic", { params });
  }

  getStudentFilesForAppPrint(): Observable<any> {
    const studentId = this.authService.getSessionId();

    return this.http.get<any>(STUDENTS_URL + "getStudentFilesForAppPrint/" + studentId);
  }

}

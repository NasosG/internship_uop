import { Injectable } from "@angular/core";
import { Student } from "./student.model";
import { mergeMap, Observable } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { EntryForm } from "./entry-form.model";
import { ExitForm } from "./exit-form.model";
import { EvaluationForm } from "./evaluation-form.model";
import { StudentPositions } from "./student-positions.model";
import { Application } from "./application.model";
import { AtlasPosition } from "./atlas-position.model";
import { Department } from "./department.model";
import { City } from "./city.model";
import { Period } from "../department-managers/period.model";
import { Country } from "./country.model";
import { PhysicalObject } from "./physical-object.model";
import { environment } from "src/environments/environment";
import { AcceptedAssignmentsByCompany } from "./accepted-assignments-by-company";
import {Utils} from "../MiscUtils";

const STUDENTS_URL = environment.apiUrl + "/students/";
const ATLAS_URL = environment.apiUrl + "/atlas/";
const DEPARTMENT_MANAGER_URL = environment.apiUrl + "/depmanager/";

@Injectable({ providedIn: 'root' })
export class StudentsService {
  public students: Student[] = [];
  public period!: Period;
  public fetchedStudentsObservable!: Observable<Array<Student>>;
  // private studentsUpdated = new Subject<Student[]>();
  public fetchedPeriodObservable!: Observable<Period>;
  constructor(private http: HttpClient, public authService: AuthService) { }

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

  getEvaluationQuestions(): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(STUDENTS_URL + 'getStudentEvaluationSheetsQuestions/');
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
  }

  getLatestPeriodOfStudent(departmentId: number): Observable<any> {
    const studentId = this.authService.getSessionId();

    const params = new HttpParams()
      .set('studentId', studentId)
      .set('departmentId', departmentId);

    return this.http.get<any>(STUDENTS_URL + 'getLatestPeriodOfStudent/', { params });
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
  
  receiveEvaluationFormFile(id: any, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "produceEvaluationFormFile/" + id;
    return this.http.post(url, { 'doctype': 'docType' }, { responseType: 'blob' });
  }

  public fetchStudentsAndPeriod(): Observable<Period> {
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
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
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

  updateStudentExtraContractDetails(data: any) {
    const id = this.authService.getSessionId();
    this.http
      .put<{ message: string }>(STUDENTS_URL + "updateStudentExtraContractDetails/" + id, data)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentContractSSNFile(file: any): any {
    const id = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentSSNFile/" + id, file);
  }

  // Not so much needed as updateStudentFile exists, but changes to prod may create problems
  updateStudentContractFile(file: any, type: string): any {
    const id = this.authService.getSessionId();
    if (type == 'AMA')
      return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentAMAFile/" + id, file);
    else if (type == 'IDENTITY')
     return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentIdentityCardFile/" + id, file);
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
    else if (type == 'RESIGN')
      return this.http
      .post<{ message: string }>(STUDENTS_URL + "updateStudentResignAppFile/" + id, file);
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

  insertStudentEntrySheet(inputForm: any): Observable<any> {
    const studentId = this.authService.getSessionId();
    const form: EntryForm = inputForm;

    return this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentEntrySheet/" + studentId, form);
  }

  insertStudentExitSheet(exitForm: any): Observable<any> {
    const studentId = this.authService.getSessionId();
    const form: ExitForm = exitForm;
    return this.http
      .post<{ message: string }>(STUDENTS_URL + "insertStudentExitSheet/" + studentId, form);
  }

  insertStudentEvaluationSheet(evaluationForm: any) {
    const studentId = this.authService.getSessionId();
    const form: EvaluationForm = { 
      student_id: studentId ?? null,
      digital_signature: evaluationForm?.digital_signature ?? null,
      answers: Utils.mapFormDataToAnswers(evaluationForm, 'question_id', 'answer')
    };
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

  checkPositionOfAtlasExists(positions: any): Observable<any> {
    const studentId = this.authService.getSessionId();
    return this.http.post<{ message: string }>(STUDENTS_URL + "checkPositionOfAtlasExists/" + studentId, { positions });
  }

  // get assignments by student id
  getAssignmentsByStudentId(): Observable<Array<AcceptedAssignmentsByCompany>> {
    const studentId = this.authService.getSessionId();
    return this.http.get<Array<AcceptedAssignmentsByCompany>>(STUDENTS_URL + "getAssignmentsByStudentId/" + studentId);
  }

  acceptCompanyPosition(assignment: AcceptedAssignmentsByCompany, implementationDates: any = null) {
    const studentId = this.authService.getSessionId();
    const form: any = { 'assignment': assignment, implementationDates: implementationDates };
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

  getAssignImplementationDates(department_id: number, period_id?: number) : Observable<any> {
    const params = new HttpParams()
      .set('department_id', department_id)
      .set('period_id', period_id == null ? 0 : period_id);
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getAssignImplementationDates/", { params });
  }

  receiveFile(studentId: number, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "sendFile/" + studentId;
    return this.http.post(url, { 'doctype': docType }, { responseType: 'blob' });
   }

  receiveContractFile(studentId: number, periodId: any, departmentId: any, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "produceContractFile/" + studentId;
    return this.http.post(url, { 'doctype': docType, 'periodId': periodId, 'departmentId': departmentId }, { responseType: 'blob' });
  }

  getImplementationDatesByStudentAndPeriod(periodId?: number, positionId?: number): Observable<any> {
    const studentId = this.authService.getSessionId();
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('periodId', periodId == null ? 0 : periodId)
      .set('positionId', positionId == null ? 0 : positionId);
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getImplementationDatesByStudentAndPeriod/", { params });
  }

  isEntrySheetEnabledForStudent(): Observable<boolean> {
    const studentId = this.authService.getSessionId();
    const params = new HttpParams()
      .set('studentId', studentId);
    return this.http.get<boolean>(STUDENTS_URL + "isEntrySheetEnabledForStudent/", { params });
  }

  isExitSheetEnabledForStudent(): Observable<boolean> {
    const studentId = this.authService.getSessionId();
    const params = new HttpParams()
      .set('studentId', studentId);
    return this.http.get<boolean>(STUDENTS_URL + "isExitSheetEnabledForStudent/", { params });
  }

  getStudentContractStatus(): Observable<any> {
    const studentId = this.authService.getSessionId();
    const url = STUDENTS_URL + "/students/" + studentId + "/contract-status";
    return this.http.get<any>(url);
  }
}

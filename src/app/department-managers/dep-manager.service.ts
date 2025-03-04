import { Injectable } from '@angular/core';
import { forkJoin, mergeMap, Observable, of, Subject, switchMap, toArray } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { DepManager } from "./dep-manager.model";
import { Period } from './period.model';
import { Student } from '../students/student.model';
import { ActiveApplication } from './active-application.model';
import { environment } from "src/environments/environment";
import { EntryForm } from '../students/entry-form.model';
import { ExitForm } from '../students/exit-form.model';
import { Phase } from './phase.model';
import { AcceptedAssignmentsByCompany } from '../students/accepted-assignments-by-company';
import { Contract } from '../students/contract.model';

const STUDENTS_URL = environment.apiUrl + "/students/";
const DEPARTMENT_MANAGER_URL = environment.apiUrl + "/depmanager/";
const ATLAS_URL = environment.apiUrl + "/atlas/"

@Injectable({
  providedIn: 'root'
})
export class DepManagerService {

  public managerArray: DepManager[] = [];
  public manager!: DepManager;
  public period!: Period;
  public activeApplications!: ActiveApplication[];
  public fetchedManagerArrayObservable!: Observable<Array<DepManager>>;
  public fetchedManagerObservable!: Observable<DepManager>;
  public fetchedPeriodObservable!: Observable<Period>;
  public fetchedStudentObservable!: Observable<Student>;
  students!: Student;

  constructor(private http: HttpClient, public authService: AuthService) { }

  getDepartmentId() {
    return this.manager.department_id;
  }

  getDepManager(): Observable<DepManager> {
    const id = this.authService.getSessionId();
    const fetchedManager = this.http.get<DepManager>(DEPARTMENT_MANAGER_URL + "getDepManagerById/" + id);
    this.fetchedManagerObservable = fetchedManager;
    this.fetchedManagerObservable.subscribe((managers: DepManager) => {
      this.manager = managers;
    });
    return fetchedManager;
  }

  getPeriodByUserId(): Observable<Period> {
    const id = this.authService.getSessionId();
    const fetchedPeriod = this.http.get<Period>(DEPARTMENT_MANAGER_URL + "getPeriodByUserId/" + id);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
  }

  getPeriodByDepartmentId(departmentId: number): Observable<Period> {
    const fetchedPeriod = this.http.get<Period>(DEPARTMENT_MANAGER_URL + "getPeriodByDepartmentId/" + departmentId);
    this.fetchedPeriodObservable = fetchedPeriod;
    this.fetchedPeriodObservable.subscribe((periods: Period) => {
      this.period = periods;
    });
    return fetchedPeriod;
  }

  getPeriodAndDepartmentIdByUserId(): Observable<any> {
    const id = this.authService.getSessionId();
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getPeriodAndDepartmentIdByUserId/" + id);
  }

  getEspaPositionsByDepartmentId(departmentId: number): Observable<any> {
    return this.http
      .get<any>(DEPARTMENT_MANAGER_URL + "getEspaPositionsByDepartmentId/" + departmentId);
  }

  getStudentsApplyPhase(): Observable<Student[]> {
    const fetchedStudent = this.getDepManager()
      .pipe(
        mergeMap(result => this.getStudentsApplyPhaseByDeptId(result?.department_id))
      )
    return fetchedStudent;
  }

  getStudentsApplyPhaseByDeptId(departmentId: number): Observable<Student[]> {
    const fetchedStudent = this.http.get<Student[]>(DEPARTMENT_MANAGER_URL + "getStudentsApplyPhase/" + departmentId);
    // this.fetchedStudentObservable = fetchedStudent;
    // this.fetchedStudentObservable.subscribe((students: Student[]) => {
    //   this.students = students;
    // });
    return fetchedStudent;
  }

  getRankedStudentsByDeptId(departmentId: number, periodId: number): Observable<Student[]> {
    const params = new HttpParams()
      .set('departmentId', departmentId)
      .set('periodId', periodId);

    const fetchedStudent = this.http.get<Student[]>(DEPARTMENT_MANAGER_URL + "getRankedStudentsByDeptId/", { params });

    return fetchedStudent;
  }

  // getStudentsRankingList(): Observable<Student[]> {
  //   const fetchedStudents = this.getDepManager()
  //   .subscribe((depManager:DepManager)=> {
  //     let depMan = depManager;
  //     this.getPeriodByDepartmentId(depMan.department_id)
  //       .subscribe((result:any) => {
  //         this.getStudentsRankingList(result?.department_id, result?.id))
  //         .subscribe((result:any) => {
  //         // this.getStudentsRankingList(result?.department_id, result?.id))
  //         });
  //     }
  //   }
  //     // .pipe(
  //     //   switchMap(depManager => this.getPeriodByDepartmentId(depManager.department_id)),
  //     //   switchMap(result => this.getStudentsRankingListFromAPI(result?.department_id, result?.id))
  //     //   // ,
  //     //   // toArray(),
  //     //   // mergeMap(students => forkJoin(students))
  //     // );

  //   return fetchedStudents;
  // }
  getStudentsRankingList(periodId?: number): Observable<Student[]> {
       return this.getStudentsRankingListFromAPI(1517,periodId);
  }


  getStudentsRankingListFromAPI(departmentId?: number, periodId?: number): Observable<Student[]> {
    if (!periodId || !departmentId) return of();

    const params = new HttpParams()
      .set('departmentId', departmentId)
      .set('periodId', periodId);

    const fetchedStudent = this.http.get<Student[]>(DEPARTMENT_MANAGER_URL + "getStudentsRankingList/", { params });

    return fetchedStudent;
  }

  getStudentActiveApplications(departmentId: number): Observable<Array<ActiveApplication>> {
    return this.http
      .get<Array<ActiveApplication>>(DEPARTMENT_MANAGER_URL + "getStudentActiveApplications/" + departmentId);
  }

  getStudentsWithSheetInput(periodId: number): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(DEPARTMENT_MANAGER_URL + "getStudentsWithSheetInput/" + periodId);
  }

  getStudentsWithSheetOutput(periodId: number): Observable<Array<any>> {
    return this.http
      .get<Array<any>>(DEPARTMENT_MANAGER_URL + "getStudentsWithSheetOutput/" + periodId);
  }

  getStudentEntrySheetsByStudentId(studentId: string): Observable<Array<EntryForm>> {
    return this.http
      .get<Array<EntryForm>>(STUDENTS_URL + 'getStudentEntrySheets/' + studentId);
  }

  getStudentExitSheetsByStudentId(studentId: string): Observable<Array<ExitForm>> {
    return this.http
      .get<Array<ExitForm>>(STUDENTS_URL + 'getStudentExitSheets/' + studentId);
  }

  insertPeriod(inputForm: any, departmentId: number) {
    const depManagerId = this.authService.getSessionId();
    const form: Period = inputForm;

    const params = new HttpParams()
      .set('depManagerId', depManagerId)
      .set('departmentId', departmentId);

    this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertPeriod/", form, { params })
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertApprovedStudentsRank(depId: number, phase: number, periodId: number): Observable<any> {
    return this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertApprovedStudentsRank/" + depId, { 'phase': phase, 'periodId': periodId });
      // .subscribe(responseData => {
      //   console.log(responseData.message);
      // });
  }

  receiveFile(studentId: number, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "sendFile/" + studentId;
    return this.http.post(url, { 'doctype': docType }, { responseType: 'blob' });
    // .pipe(
    //   takeWhile( () => this.alive),
    //   filter ( image => !!image));
  }

  receiveContractFile(studentId: number, periodId: any, departmentId: any, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "produceContractFile/" + studentId;
    return this.http.post(url, { 'doctype': docType, 'periodId': periodId, 'departmentId': departmentId }, { responseType: 'blob' });
    // .pipe(
    //   takeWhile( () => this.alive),
    //   filter ( image => !!image));
  }

  receiveCompletionCertificateFile(data: any, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "produceCompletionCertificateFile/";
    return this.http.post(url, { 'doctype': docType, 'data': data }, { responseType: 'blob' });
  }

  receivePaymentOrderFile (studentId: number, periodId: any, departmentId: any, docType: string): Observable<Blob> {
    const url = STUDENTS_URL + "producePaymentOrderFile/" + studentId;
    return this.http.post(url, { 'doctype': docType, 'periodId': periodId, 'departmentId': departmentId }, { responseType: 'blob' });
  }

  updatePeriodById(inputForm: any, periodId: number) {
    const form: Period = inputForm;
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updatePeriodById/" + periodId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  deletePeriodById(periodId: number) {
    this.http
      .delete<{ message: string }>(DEPARTMENT_MANAGER_URL + "deletePeriodById/" + periodId)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  completePeriodById(periodId: number, departmentId?: number): Observable<{ message: string; }> {
    return this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "completePeriodById/" + periodId, { departmentId });
  }

  updatePhaseByStudentId(phase: number, studentId: number, periodId: number | null) {
    const phaseJson: any = { 'phase': phase, 'periodId': periodId };
    console.log(phaseJson);
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updatePhaseByStudentId/" + studentId, phaseJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  updateStudentRanking(positionsArray: Array<Student>, periodId: number) {
    const form: Array<Student> = positionsArray;
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updateStudentRanking/" + periodId, form)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertCommentsByStudentId(studentData: any, comments: string) {
    const bodyJson: any = { 'comments': comments, 'studentMail': studentData.mail};
    const studentId = studentData.uuid;
    this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertCommentsByStudentId/" + studentId, bodyJson)
      .subscribe(responseData => {
        console.log(responseData.message);
        location.reload();
      });
  }

  updateCommentsByStudentId(studentData: any, comments: string) {
    const bodyJson: any = { 'comments': comments, 'studentMail': studentData.mail};
    const studentId = studentData.uuid;
    this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updateCommentsByStudentId/" + studentId, bodyJson)
      .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  getCommentByStudentIdAndSubject(studentId: number, subject: string): Observable<any> {
     const params = new HttpParams()
      .set('studentId', studentId)
      .set('subject', subject);
    const fetchedComment = this.http.get<any>(DEPARTMENT_MANAGER_URL + "getCommentByStudentIdAndSubject/", { params });
    return fetchedComment;
  }

  getManagedAcademics(): Observable<any> {
    const userId = this.authService.getSessionId();
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getManagedDepartmentsByUserId/" + userId);
  }

  updateStudentDepartmentId(departmentId: number): Observable<any> {
    const userId = this.authService.getSessionId();
    return this.http
      .patch<any>(DEPARTMENT_MANAGER_URL + "updateDepartmentIdByUserId/" + userId, { departmentId });
  }

  getPhasesByPeriodId(periodId: number): Observable<Phase[]> {
    return this.http.get<Phase[]>(DEPARTMENT_MANAGER_URL + "getPhasesByPeriodId/" + periodId);
  }

  getPositionsByApplicationId(applicationId: number): Observable<any[]> {
    return this.http.get<any[]>(DEPARTMENT_MANAGER_URL + "getPositionsByApplicationId/" + applicationId);
  }

  insertAssignment(apps: any): Observable<any> {
    const providerId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "/insertNewAssignment/" + providerId, apps);
  }

  acceptCompanyPosition(studentId: number, positionId: number, implementationDates = null) {
    // const form: any = { 'assignment': assignment };
    return this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertFinalAssignment/" + studentId, {"position_id": positionId, implementationDates: implementationDates});
  }

  getAssignmentsByStudentId(studentId: number): Observable<Array<AcceptedAssignmentsByCompany>> {
    return this.http.get<Array<AcceptedAssignmentsByCompany>>(STUDENTS_URL + "getAssignmentsByStudentId/" + studentId);
  }

  insertImplementationDates(implementationDates: any) {
    const providerId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "insertAssignImplementationDates/" + providerId, implementationDates);
  }

  getAssignImplementationDates(department_id: number, period_id?: number) : Observable<any> {
    const params = new HttpParams()
      .set('department_id', department_id)
      .set('period_id', period_id == null ? 0 : period_id);
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getAssignImplementationDates/", { params });
  }

  submitFinalResultsToOffice(data: {department_id: number; period_id: number|undefined; implementation_start_date: string; implementation_end_date: string;}) {
    const providerId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(DEPARTMENT_MANAGER_URL + "submitFinalResultsToOffice/" + providerId, { data });
  }

  getStudentListForPeriod(periodId: number): Observable<any> {
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getStudentListForPeriod/" + periodId);
  }

  getStudentPaymentsListForPeriod(periodId: number): Observable<any> {
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getStudentPaymentsListForPeriod/" + periodId);
  }

  getAllPeriodsByDepartmentId(departmentId: number): Observable<any[]> {
    return this.http.get<Period[]>(DEPARTMENT_MANAGER_URL + "getAllPeriodsByDepartmentId/" + departmentId);
  }

  getContractDetailsByStudentIdAndPeriodId(studentId: number, periodId: number): Observable<Contract> {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('periodId', periodId == null ? 0 : periodId);
    return this.http.get<Contract>(STUDENTS_URL + "getContractDetailsByStudentIdAndPeriod/", { params });
  }

  getContractDetailsByDepartmentAndPeriod(departmentId: number, periodId: number): Observable<Array<Contract>> {
    const params = new HttpParams()
      .set('departmentId', departmentId)
      .set('periodId', periodId == null ? 0 : periodId);
    return this.http.get<Array<Contract>>(STUDENTS_URL + "getContractDetailsByDepartmentAndPeriod/", { params });
  }

  onSubmitStudentContractDetails(contract: Contract, studentId: number, periodId: number): Observable<any>{
    return this.http
      .put<{ message: string }>(STUDENTS_URL + "updateContractDetails/" + studentId, {contract, periodId});
  }

  onSubmitStudentPaymentDetails(contract: Contract, studentId: number, periodId: number): Observable<any>{
    return this.http
      .put<{ message: string }>(STUDENTS_URL + "updatePaymentOrderDetails/" + studentId, {contract, periodId});
  }

  getImplementationDatesByStudentAndPeriod(studentId: number, periodId: number, positionId: number): Observable<any> {
    const params = new HttpParams()
      .set('studentId', studentId)
      .set('periodId', periodId == null ? 0 : periodId)
      .set('positionId', positionId == null ? 0 : positionId);
    return this.http.get<any>(DEPARTMENT_MANAGER_URL + "getImplementationDatesByStudentAndPeriod/", { params });
  }

  updateImplementationDatesByStudentAndPeriod(studentId: number, periodId: number, implementationDates: any, positionId: number) {
    return this.http
      .put<{ message: string }>(DEPARTMENT_MANAGER_URL + "updateImplementationDatesByStudentAndPeriod/" + studentId, { periodId, implementationDates, positionId });
  }

  changeImplementationDatesAtlasByAssignedPositionId(assignedPositionId: number, implementationDates: any): Observable<any> {
    return this.http
      .post<{ message: string }>(ATLAS_URL + "changeImplementationDatesAtlas/" + assignedPositionId, { implementationDates });
  }

  getAssignedPositionById(assignedPositionId: number): Observable<any> {
    return this.http.get<any>(ATLAS_URL + "getAssignedPositionById/" + assignedPositionId);
  }

  completeAtlasPosition(assignedPositionId: number,  implementationDates: any, completionComments: string): Observable<any> {
    return this.http
      .post<{ message: string }>(ATLAS_URL + "completeAtlasPosition/" + assignedPositionId, { implementationDates, completionComments });
  }

  updateAssignmentStateByStudentAndPosition(studentId: number, positionId: number, periodId: number): Observable<any> {
    console.log(positionId);
    return this.http
      .put<{ message: string }>(STUDENTS_URL + "updateAssignmentStateByStudentAndPosition/" + studentId, { positionId, periodId });
  }

  getStudentContractStatus(studentId: string): Observable<any> {
    const url = STUDENTS_URL + "/students/" + studentId + "/contract-status";
    return this.http.get<any>(url);
  }
}

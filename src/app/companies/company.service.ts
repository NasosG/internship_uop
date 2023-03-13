
import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from "./company.model";
import { ActiveApplicationsRanked } from './active-applications-ranked.model';
import { InternalPosition } from './internal-position.model';
import { environment } from 'src/environments/environment';
import {CompanysActiveApplications} from './companys-active-applications.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public companyArray: Company[] = [];
  public company!: Company;
  public fetchedCompanyArrayObservable!: Observable<Array<Company>>;
  public fetchedCompanyObservable!: Observable<Company>;

  constructor(private http: HttpClient, public authService: AuthService) { }

  private readonly baseUrl = environment.apiUrl + "/company";

  public getCompaniesByAfm(afm: string): Observable<Array<Company>> {
    const fetchedCompanies = this.http.get<Array<Company>>(this.baseUrl + "/getProviderByAfm/" + afm);

    // this.fetchedCompanyArrayObservable = fetchedCompanies;
    // this.fetchedCompanyArrayObservable.subscribe((companies: Company[]) => {
    //   this.companyArray = [...companies];
    // });
    return fetchedCompanies;
  }

  getCompaniesByAfmAndCompanyName(companyAFM: string, companyName: string): Observable<Array<Company>> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('companyAFM', companyAFM);
    const fetchedCompanies = this.http.get<Array<Company>>(this.baseUrl + "/getProviderByAfmAndName", { params });

    return fetchedCompanies;
  }

  public getStudentActiveApplications(companyName: string, companyAFM: string): Observable<Array<CompanysActiveApplications>> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('companyAFM', companyAFM);
    return this.http.get<Array<CompanysActiveApplications>>(this.baseUrl + "/getStudentActiveApplications", { params });
  }

  public getStudentAssignedApplications(companyName: string, companyAFM: string): Observable<Array<CompanysActiveApplications>> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('companyAFM', companyAFM);
    return this.http.get<Array<CompanysActiveApplications>>(this.baseUrl + "/getStudentAssignedApplications", { params });
  }

  public getInternalPositions(): Observable<Array<InternalPosition>>  {
    const providerId = this.authService.getSessionId();
    return this.http
      .get<Array<InternalPosition>>(this.baseUrl + "/getInternalPositionsByProviderId/" + providerId);
  }

  insertCompany(companyDetails: any) {
    return this.http
      .post<{ message: string }>(this.baseUrl + "/insertCompanyUser/", companyDetails);
      //  .subscribe(responseData => {
      //   console.log(responseData.message);
      // });
  }

  getProviderById(): Observable<Company> {
    const providerId = this.authService.getSessionId();
    return this.http
      .get<Company>(this.baseUrl + "/getProviderById/" + providerId );
  }

  loginCompany(companyDetails: any) {
    this.http
      .post<{ message: string }>(this.baseUrl + "/insertCompanyUser/", companyDetails)
       .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertNewPosition(companyDetails: any) {
    // New Internal Position Insertion
    const providerId = this.authService.getSessionId();
    console.log(providerId);


    // console.log("company " + companyDetails.country);
    // console.log("descr " + companyDetails.description);
    // console.log("title " + companyDetails.title);
    // console.log("postype " + companyDetails.position_type);
    // console.log("duration " + companyDetails.duration);
    // console.log("pho " + companyDetails.physical_objects);
    // console.log("apos " + companyDetails.available_positions);
    // console.log("city " + companyDetails.city);
    // console.log("prefecture " + companyDetails.prefecture);
     this.http
      .post<{ message: string }>(this.baseUrl + "/insertInternalPosition/" + providerId, companyDetails)
       .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertAssignment(apps: any): Observable<any> {
    //TODO
    const providerId = this.authService.getSessionId();
    return this.http
      .post<{ message: string }>(this.baseUrl + "/insertNewAssignment/" + providerId, apps);
  }


  public resetPassword(email: string) {
    console.log(email);
    return this.http.post<any>(this.baseUrl + "/resetPassword", {"providerMail": email}, {observe: 'response'});
  }
}

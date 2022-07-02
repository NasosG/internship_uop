
import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from "./company.model";
import {ActiveApplicationsRanked} from './active-applications-ranked.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  public companyArray: Company[] = [];
  public company!: Company;
  public fetchedCompanyArrayObservable!: Observable<Array<Company>>;
  public fetchedCompanyObservable!: Observable<Company>;

  constructor(private http: HttpClient, public authService: AuthService) { }

  private readonly baseUrl = "http://localhost:3000/api/company";

  public getCompaniesByAfm(afm: string): Observable<Array<Company>> {
    const fetchedCompanies = this.http.get<Array<Company>>(this.baseUrl + "/getProviderByAfm/" + afm);

    // this.fetchedCompanyArrayObservable = fetchedCompanies;
    // this.fetchedCompanyArrayObservable.subscribe((companies: Company[]) => {
    //   this.companyArray = [...companies];
    // });
    return fetchedCompanies;
  }

  public getStudentActiveApplications(companyName: string, companyAFM: string): Observable<Array<ActiveApplicationsRanked>> {
    const params = new HttpParams()
      .set('companyName', companyName)
      .set('companyAFM', companyAFM);
    return this.http.get<Array<ActiveApplicationsRanked>>(this.baseUrl + "/getStudentActiveApplications", { params });
  }

  insertCompany(companyDetails: any) {
    return this.http
      .post<{ message: string }>(this.baseUrl + "/insertCompanyUser/", companyDetails );
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
      .post<{ message: string }>(this.baseUrl + "/insertCompanyUser/", companyDetails )
       .subscribe(responseData => {
        console.log(responseData.message);
      });
  }

  insertNewPosition() {
   //TODO: NEW POSITION INSERTION
  }

  insertAssignment() {
    //TODO
  }
}

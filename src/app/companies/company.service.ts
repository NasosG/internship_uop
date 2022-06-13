
import { Injectable } from '@angular/core';
import { mergeMap, Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AuthService } from 'src/app/auth/auth.service';
import { Company } from "./company.model";

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

  insertCompany(companyDetails: any) {
    console.log("2 " + {companyDetails});
    this.http
      .post<{ message: string }>(this.baseUrl + "/insertCompanyUser/", companyDetails )
       .subscribe(responseData => {
        console.log(responseData.message);
      });
  }
}

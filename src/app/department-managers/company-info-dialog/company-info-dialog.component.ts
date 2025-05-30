import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/companies/company.model';
import { CompanyService } from 'src/app/companies/company.service';

@Component({
  selector: 'app-company-info-dialog',
  templateUrl: './company-info-dialog.component.html',
  styleUrls: ['./company-info-dialog.component.css']
})
export class CompanyInfoDialogComponent implements OnInit {
  public companyData: Company|undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
              public dialogRef: MatDialogRef<CompanyInfoDialogComponent>,
              private companyService: CompanyService) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Get company data using afm and company name
    this.companyService.getCompaniesByAfmAndCompanyName(this.data.afm, this.data.company).subscribe((company: Company[]) => {
      this.companyData = company[0];
    });
  }

}

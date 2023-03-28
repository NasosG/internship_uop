import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'src/app/companies/company.model';
import { CompanyService } from 'src/app/companies/company.service';

@Component({
  selector: 'app-company-and-position-info-dialog',
  templateUrl: './company-and-position-info-dialog.component.html',
  styleUrls: ['./company-and-position-info-dialog.component.css']
})
export class CompanyAndPositionInfoDialogComponent implements OnInit {

  public companyData: Company|undefined;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
              public dialogRef: MatDialogRef<CompanyAndPositionInfoDialogComponent>,
              private companyService: CompanyService) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Get company data using afm and company name
    this.companyService.getCompanyDetailsByPositionId(this.data.positionId).subscribe((company: Company) => {
      this.companyData = company;
    });
  }

}

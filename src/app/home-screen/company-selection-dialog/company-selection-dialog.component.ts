import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from '../../companies/company.model';

@Component({
  selector: 'app-company-selection-dialog',
  templateUrl: './company-selection-dialog.component.html',
  styleUrls: ['./company-selection-dialog.component.css']
})
export class CompanySelectionDialogComponent implements OnInit {
  selectedRow!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<CompanySelectionDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void { }

  changeSelectedRow(id: number) {
    this.selectedRow = id;
  }
}

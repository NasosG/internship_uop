import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import {DepManagerService} from '../dep-manager.service';
import {Phase} from '../phase.model';

@Component({
  selector: 'app-period-preview-dialog',
  templateUrl: './period-preview-dialog.component.html',
  styleUrls: ['./period-preview-dialog.component.css']
})
export class PeriodPreviewDialogComponent implements OnInit {
  public phases : Phase[] = [
    { phase_number: 1, period_id: 1, date_from: moment().format('DD/MM/YYYY'), date_to: moment().format('DD/MM/YYYY')}, {
    phase_number: 2, period_id: 1, date_from: moment().format('DD/MM/YYYY'), date_to: moment().format('DD/MM/YYYY') }];

  displayedColumns: string[] = ['phase', 'dateFrom', 'dateTo'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<PeriodPreviewDialogComponent>
  ) { }

  ngOnInit(): void {
    this.depManagerService.getPhases(this.data.periodId).subscribe((phases: any) => {
      this.phases = phases;
    });
  }
  onCancel(): void {
    this.dialogRef.close();
  }

}

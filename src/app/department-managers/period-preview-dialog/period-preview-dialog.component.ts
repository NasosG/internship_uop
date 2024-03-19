import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { DepManagerService } from '../dep-manager.service';
import { Phase } from '../phase.model';

@Component({
  selector: 'app-period-preview-dialog',
  templateUrl: './period-preview-dialog.component.html',
  styleUrls: ['./period-preview-dialog.component.css']
})
export class PeriodPreviewDialogComponent implements OnInit {
  public phases!: Phase[];

  displayedColumns: string[] = ['phase', 'dateFrom', 'dateTo'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, public depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<PeriodPreviewDialogComponent>
  ) { }

  ngOnInit(): void {
    this.depManagerService.getPhasesByPeriodId(this.data.periodId).subscribe((phases: Phase[]) => {
      this.phases = phases;
      for (let phase of this.phases) {
        phase.date_from = moment(phase.date_from).format('DD/MM/YYYY');
        phase.date_to = moment(phase.date_to).format('DD/MM/YYYY');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

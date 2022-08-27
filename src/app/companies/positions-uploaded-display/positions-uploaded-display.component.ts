import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { CompanyService}  from '../company.service';
import { InternalPosition } from '../internal-position.model';
import { PositionPreviewDialogComponent } from '../position-preview-dialog/position-preview-dialog.component';

@Component({
  selector: 'app-positions-uploaded-display',
  templateUrl: './positions-uploaded-display.component.html',
  styleUrls: ['./positions-uploaded-display.component.css']
})
export class PositionsUploadedDisplayComponent implements OnInit {
  positions: InternalPosition[] = [];

  constructor(public authService: AuthService, public dialog: MatDialog, private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getInternalPositions()
      .subscribe((positions: InternalPosition[]) => {
        this.positions = positions;
    })
  }

  openDialog(data: InternalPosition) {
    const dialogRef = this.dialog.open(PositionPreviewDialogComponent, {
      data: { internal_positions: data }
    });
  }
}

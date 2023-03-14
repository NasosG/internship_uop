import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Utils } from 'src/app/MiscUtils';
import Swal from 'sweetalert2';
import { DepManager } from '../dep-manager.model';
import { DepManagerService } from '../dep-manager.service';
import { PeriodPreviewDialogComponent } from '../period-preview-dialog/period-preview-dialog.component';
import { Period } from '../period.model';

@Component({
  selector: 'app-department-manager-header',
  templateUrl: './department-manager-header.component.html',
  styleUrls: ['./department-manager-header.component.css']
})
export class DepartmentManagerHeaderComponent implements OnInit {

  public depManagerData!: DepManager;
  public periodData!: Period;
  // private studentSubscription!: Subscription;
  fontSize: number = 100;
  private language!: string;
  dateFrom: string = "";
  dateTo: string = "";

  phaseArray = ["no-state",
    "1. Αιτήσεις ενδιαφέροντος φοιτητών",
    "2. Επιλογή θέσεων από φοιτητές",
    "3. Ολοκλήρωση - Συμβάσεις"];

  constructor(public depManagerService: DepManagerService, public authService: AuthService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
    this.language = localStorage.getItem('language') || 'gr';

    // this.authService.login('');
    this.depManagerService.getDepManager()
      .subscribe((depManager: DepManager) => {
        this.depManagerData = depManager;
        this.depManagerData.schacdateofbirth = Utils.reformatDateOfBirth(this.depManagerData.schacdateofbirth);

        this.depManagerService.getPeriodByDepartmentId(this.depManagerData.department_id)
          .subscribe((periodData: Period) => {
            this.periodData = periodData;
            this.dateFrom = Utils.changeDateFormat(periodData.date_from);
            this.dateTo = Utils.changeDateFormat(periodData.date_to);
        });
      });
  }

  deletePeriodById() {
    this.depManagerService.getStudentsApplyPhase()
      .subscribe((studentApps: any) => {
        let text: string = 'Είστε σίγουροι ότι θέλετε να προχωρήσετε σε διαγραφή περιόδου;';

        if (studentApps.length > 0) {
          text = 'Υπάρχουν φοιτητές που έχουν υποβάλει αίτηση. Είστε σίγουροι ότι θέλετε να διαγραφεί η περίοδος; Θα πρέπει οι φοιτητές να υποβάλλουν νέα αίτηση.';
        }

        this.deletePeriod(this.periodData.id, text);
      });
  }

  deletePeriod(periodId: number, inputText: string) {
    Swal.fire({
      title: 'Διαγραφή Περιόδου',
      text: inputText,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.depManagerService.deletePeriodById(periodId);
        Swal.fire({
          title: 'Διαγραφή περιόδου',
          text: 'Η περίοδος έχει διαγραφεί.',
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'ΟΚ'
        }).then(() => {
            if (this.router.url != '/department-manager/' + this.authService.getSessionId())
              this.router.navigateByUrl('/department-manager/' + this.authService.getSessionId());
            else location.reload();
        });
      }
    });
  }

  openDialog(periodIdParam: any) {
    const dialogRef = this.dialog.open(PeriodPreviewDialogComponent, {
      // width: '350px',
      data: { periodId: periodIdParam }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}


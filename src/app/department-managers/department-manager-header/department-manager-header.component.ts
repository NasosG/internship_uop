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
  /** true until the department and its period have loaded (or failed: no period), for the loader */
  isLoading: boolean = true;
  /** Small screens, card of the current period: where today is in its current phase (for the progress bar) */
  phaseProgress: { percent: number, day: number, total: number, days: number, label: string } | null = null;

  phaseArray = ["no-state",
    "1. Αιτήσεις ενδιαφέροντος φοιτητών",
    "2. Επιλογή θέσεων από φοιτητές"];

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
            this.isLoading = false;
            this.dateFrom = Utils.changeDateFormat(periodData.date_from);
            this.dateTo = Utils.changeDateFormat(periodData.date_to);
            this.phaseProgress = this.computePhaseProgress(periodData?.date_from, periodData?.date_to);
            // The table of the period appears with the data, often after the app has given the tables their dark mode
            // class (table-dark, given on every switch of the mode), so it depended on which came first: give it here
            // too, once the table is drawn
            setTimeout(() => {
              if (document.body.classList.contains('dark-mode')) document.getElementById('dep-manager-table')?.classList.add('table-dark');
            });
        }, () => { this.isLoading = false; });
      }, () => { this.isLoading = false; });
  }

  /** Small screens, card of the period: the phase as "Phase 1 · <text>" from "1. <text>" of phaseArray */
  get phaseLabel(): { number: string, text: string } {
    const phase = this.phaseArray[(this.periodData?.phase_state)!] || '';
    const match = phase.match(/^(\d+)\.\s*(.*)$/);
    return match ? { number: match[1], text: match[2] } : { number: '', text: phase };
  }

  /** Small screens: in capitals and without accents (Greek capitals do not take them), e.g. the labels of the dates */
  capitals(text: string): string {
    return (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  }

  /** Where today is in the phase from dateFrom to dateTo ("2026-11-11", local whole days): the percent of the bar, the day
   *  of the phase, and the text on its right (starts in / ends in N days, tomorrow, today, ended) */
  computePhaseProgress(dateFrom: any, dateTo: any) {
    const toDay = (value: any) => {
      const [y, m, d] = String(value || '').substring(0, 10).split('-').map(Number);
      return y && m && d ? new Date(y, m - 1, d).getTime() : NaN;
    };
    const from = toDay(dateFrom), to = toDay(dateTo);
    if (isNaN(from) || isNaN(to) || to < from) return null;
    const now = new Date(), today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const DAY = 24 * 60 * 60 * 1000, total = Math.round((to - from) / DAY) + 1;
    if (today < from) {
      const days = Math.round((from - today) / DAY);
      return { percent: 0, day: 0, total, days, label: days === 1 ? 'DEPT-MANAGER.PHASE-STARTS-TOMORROW' : 'DEPT-MANAGER.PHASE-STARTS-IN' };
    }
    if (today > to) return { percent: 100, day: total, total, days: 0, label: 'DEPT-MANAGER.PHASE-ENDED' };
    const day = Math.round((today - from) / DAY) + 1, days = Math.round((to - today) / DAY);
    const label = days === 0 ? 'DEPT-MANAGER.PHASE-ENDS-TODAY' : days === 1 ? 'DEPT-MANAGER.PHASE-ENDS-TOMORROW' : 'DEPT-MANAGER.PHASE-ENDS-IN';
    return { percent: Math.round(day / total * 100), day, total, days, label };
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

  completePeriodById() {
    const inputText = 'Είστε σίγουροι ότι θέλετε να ολοκληρωθεί η περίοδος; Η ενέργεια αυτή είναι μη αναστρέψιμη. Θα πρέπει να έχετε στείλει την τελική λίστα με τους φοιτητές προς ΓΠΑ πριν συνεχίσετε.';

    Swal.fire({
      title: 'Ολοκλήρωση Περιόδου',
      text: inputText,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (result.isConfirmed) {
        this.depManagerService.completePeriodById(this.periodData.id, this.periodData.department_id)
          .subscribe((result: any) => {
            Swal.fire({
              title: 'Επιτυχής Ολοκλήρωση περιόδου',
              text: 'Η περίοδος ολοκληρώθηκε.',
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


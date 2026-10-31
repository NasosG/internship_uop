import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Utils } from 'src/app/MiscUtils';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-ops-sheets',
  templateUrl: './ops-sheets.component.html',
  styleUrls: ['./ops-sheets.component.css']
})
export class OpsSheetsComponent {
  // Submission id of the ΟΠΣ (RequestProgressID), e.g. b920d39d-d55e-41a9-a3b9-e4032183b2cf
  private static readonly REQUEST_ID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

  sheetType: 'entry' | 'exit' | null = null;
  requestId: string = '';
  isLoading: boolean = false;

  constructor(public adminService: AdminService) { }

  isRequestIdValid(): boolean {
    return OpsSheetsComponent.REQUEST_ID_PATTERN.test(this.requestId.trim());
  }

  showInvalidRequestId(): boolean {
    return this.requestId.trim().length > 0 && !this.isRequestIdValid();
  }

  /**
   * The sheet is not submitted again: only the result of its submission is requested from the ΟΠΣ
   * (second call of the upload) and, on success, its number is stored in the student's sheet
   */
  resendSheet() {
    if (!this.sheetType || !this.isRequestIdValid() || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.adminService.getOpsSheetResult(this.sheetType, this.requestId.trim())
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;

          if (res.message == 'deactivated') {
            Utils.displayErrorSwal('Η σύνδεση με το ΟΠΣ είναι απενεργοποιημένη σε αυτό το περιβάλλον.');
            return;
          }

          this.displayResultSwal(res);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error(error);

          if (error?.error?.message == 'Wrong sheet type') {
            const actualType = this.sheetType == 'entry' ? 'Εξόδου' : 'Εισόδου';
            Utils.displayErrorSwal(`Ο κωδικός υποβολής αντιστοιχεί σε Δελτίο ${actualType} (Α/Α: ${error.error.opsNumber}). `
              + `Επιλέξτε «Δελτίο ${actualType}» και δοκιμάστε ξανά.`);
            return;
          }

          Utils.displayOPSErrorSwal(error);
        }
      });
  }

  private displayResultSwal(res: any) {
    const found = `Το δελτίο βρέθηκε στο ΟΠΣ με Α/Α: ${res.opsNumber}.`;

    if (res.storage == 'saved') {
      Utils.displaySuccessSwal(found + ' Ο αριθμός αποθηκεύτηκε στο δελτίο του φοιτητή.');
    } else if (res.storage == 'existing' && String(res.existingOpsNumber) == String(res.opsNumber)) {
      Utils.displaySuccessSwal(found + ' Ο αριθμός είναι ήδη αποθηκευμένος στο δελτίο του φοιτητή.');
    } else if (res.storage == 'existing') {
      Utils.displaySuccessSwal(found + ` Το δελτίο του φοιτητή έχει ήδη άλλον αριθμό ΟΠΣ (${res.existingOpsNumber}), οπότε δεν άλλαξε.`);
    } else {
      Swal.fire({
        title: 'Δεν αποθηκεύτηκε',
        text: found + ' Δεν βρέθηκε δελτίο φοιτητή με αυτό το ΑΦΜ χωρίς αριθμό ΟΠΣ, οπότε ο αριθμός δεν αποθηκεύτηκε.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'ΟΚ'
      });
    }
  }
}

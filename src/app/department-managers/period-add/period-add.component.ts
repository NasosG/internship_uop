import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service.service';

@Component({
  selector: 'app-period-add',
  templateUrl: './period-add.component.html',
  styleUrls: ['./period-add.component.css']
})
export class PeriodAddComponent implements OnInit {

  constructor(public depManagerService: DepManagerService) { }

  ngOnInit(): void {
  }

  onSubmitPeriodForm(formData: FormData) {
    this.depManagerService.insertPeriod(formData);
    this.onSavePeriodAlert();
    // this.onSaveInputSheetSwal(formData);
  }

  public onSavePeriodAlert() {
    Swal.fire({
      title: 'Δημιουργία Περιόδου',
      text: 'Επιτυχής δημιουργία περιόδου',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}


import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service.service';

@Component({
  selector: 'app-period-add',
  templateUrl: './period-add.component.html',
  styleUrls: ['./period-add.component.css']
})

export class PeriodAddComponent implements OnInit {
  ngSelect = "";
  ngSelectPhase = "";
  public isShown: boolean = false ; // hidden by default

  toggleShow() {
    this.isShown = !this.isShown;
    let element:any;
    element = document.getElementById("toggleVisibilityAddPeriod");
    element.css("visibility", this.isShown ? "hidden" : "visible");
  }

  constructor(public depManagerService: DepManagerService) { }

  ngOnInit(): void { }

  onSubmitPeriodForm(formData: FormData) {
    this.validateFormData(formData);
    this.depManagerService.insertPeriod(formData);
    this.onSavePeriodAlert();
  }

  private validateFormData(formData: FormData) {
    for (const field of Object.values(formData)) {
      if (!field) {
        this.onFieldEmptyAlert();
        break;
      }
    }
  }

  private onSavePeriodAlert() {
    Swal.fire({
      title: 'Δημιουργία Περιόδου',
      text: 'Επιτυχής δημιουργία περιόδου',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then(() => { location.reload(); });
  }

  private onFieldEmptyAlert() {
    Swal.fire({
      title: 'Έλλειψη τιμής σε πεδίο',
      text: 'Κάποιο πεδίο ήταν κενό',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    });
  }

}


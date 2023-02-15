import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-students-position-select-dialog',
  templateUrl: './students-position-select-dialog.component.html',
  styleUrls: ['./students-position-select-dialog.component.css']
})
export class StudentsPositionSelectDialogComponent implements OnInit {
  selectedRow!: number;
  position: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<StudentsPositionSelectDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.depManagerService.getPositionsByApplicationId(this.data.appId).subscribe((positions: any[]) => {
       this.position = positions[this.data.index];
       console.log(this.position);
       this.selectedRow = positions[this.data.index].app_pos_id;
    });
  }

  onSubmitSwal(assignMode: string) {
    switch (assignMode) {
      case "preassign":
        this.onSubmitPreassignmentSwal();
        break;
      case "assign":
        this.onSubmitAssignmentSwal();
        break;
      default:
        console.error("Invalid assignMode: ", assignMode);
        break;
    }
  }

  onSubmitAssignmentSwal() {
    Swal.fire({
      title: 'Είστε σίγουρος/η για την αποδοχή της θέσης εργασίας;',
      text: 'Η επιλογή είναι οριστική και δεν μπορεί να αναιρεθεί.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ναι, αποδέχομαι',
      cancelButtonText: 'Όχι, ακύρωση'
    }).then((result) => {
      // if user clicks on confirmation button, call acceptPosition() method
      if (result.isConfirmed) {
        this.acceptCompanyPosition();
      }
    });
  }

  acceptCompanyPosition() {
    this.depManagerService.acceptCompanyPosition(this.position.student_id, this.position.position_id)
      .subscribe((response: any) => {
        console.log(response);
        location.reload();
      });
  }

  onSubmitPreassignmentSwal() {
    Swal.fire({
      title: 'Αποδοχή Φοιτητών',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην επιλογή των φοιτητών;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
      if (!result.isConfirmed) {
        console.log("User pressed Cancel");
        return;
      }

      let positionsDataJson: any[] = [];

      positionsDataJson.push({
        position_id: this.position.position_id,
        internal_position_id: this.position.internal_apps_id,
        title: this.position.title,
        city: this.position.place,
        duration: this.position.duration,
        physical_object: this.position.physical_objects,
        student_id: this.position.student_id,
        department_id: this.position.department_id,
        period_id: this.position.period_id
      });

      console.log(positionsDataJson);
      alert(`Εισαγωγή θέσης ${this.selectedRow}`);
      this.depManagerService.insertAssignment(positionsDataJson).subscribe((responseData: any) => {
        console.log(responseData.message);
        location.reload();
        //this.ngOnInit();
      }, (error: any) => {
        console.log(error);
        Swal.fire({
          title: 'Αποτυχία',
          text: 'Η αποδοχή της ανάθεσης απέτυχε',
          icon: 'error',
          confirmButtonText: 'ΟΚ'
        });
      });

    });
  }
}

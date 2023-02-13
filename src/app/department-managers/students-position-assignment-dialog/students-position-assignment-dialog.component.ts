import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DepManagerService } from '../dep-manager.service';

@Component({
  selector: 'app-students-position-assignment-dialog',
  templateUrl: './students-position-assignment-dialog.component.html',
  styleUrls: ['./students-position-assignment-dialog.component.css']
})
export class StudentsPositionAssignmentDialogComponent implements OnInit {
  selectedRow!: number;
  selectedRowsArrayIndex!: number;
  apps: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private depManagerService: DepManagerService,
    public dialogRef: MatDialogRef<StudentsPositionAssignmentDialogComponent>
  ) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.depManagerService.getPositionsByApplicationId(this.data.appId).subscribe((apps: any[]) => {
      this.apps = apps;
    });
  }

  changeSelectedRow(id: number, index: number) {
    this.selectedRow = id;
    this.selectedRowsArrayIndex = index;
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
    alert("TODO: write code for assign");
    // TODO: Write code for assignment
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
      // Inform the user and don't send the request, if selected row is empty
      if (!this.selectedRow) {
        Swal.fire({
          title: 'Αποτυχία',
          text: 'Δεν έχετε επιλέξει θέση',
          icon: 'error',
          confirmButtonText: 'ΟΚ'
        });
        return;
      }

      let positionsDataJson: any[] = [];

      positionsDataJson.push({
        position_id: this.apps[this.selectedRowsArrayIndex].position_id,
        internal_position_id: this.apps[this.selectedRowsArrayIndex].internal_apps_id,
        title: this.apps[this.selectedRowsArrayIndex].title,
        city: this.apps[this.selectedRowsArrayIndex].place,
        duration: this.apps[this.selectedRowsArrayIndex].duration,
        physical_object: this.apps[this.selectedRowsArrayIndex].physical_objects,
        student_id: this.apps[this.selectedRowsArrayIndex].student_id,
        department_id: this.apps[this.selectedRowsArrayIndex].department_id,
        period_id: this.apps[this.selectedRowsArrayIndex].period_id,
      });

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

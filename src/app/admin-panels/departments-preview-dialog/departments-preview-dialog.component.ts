import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {AdminService} from '../admin.service';

@Component({
  selector: 'app-departments-preview-dialog',
  templateUrl: './departments-preview-dialog.component.html',
  styleUrls: ['./departments-preview-dialog.component.css']
})
export class DepartmentsPreviewDialogComponent implements OnInit {
  arr: any = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,
    public dialogRef: MatDialogRef<DepartmentsPreviewDialogComponent>, public adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.adminService.getDepartmentsOfUserByUserID(this.data.userId)
      .subscribe((fetchedDepartmentIDs: any) => {
        for (let obj of fetchedDepartmentIDs) {
          obj = obj.academic_id;
          const departmentNames = this.data.departments?.find((x: {atlas_id: any, department:any;}) => x.atlas_id === obj);
          this.arr.push(departmentNames);
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

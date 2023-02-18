import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Department } from 'src/app/students/department.model';
import { StudentsService } from 'src/app/students/student.service';
import { environment } from 'src/environments/environment';
import { AdminService } from '../admin.service';
import { DepartmentsPreviewDialogComponent } from '../departments-preview-dialog/departments-preview-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  username = new FormControl('');
  roles = new FormControl('');
  academics = new FormControl('');
  isAdmin = new FormControl('');
  roleList: string[] = ['Τμηματικός Υπεύθυνος', 'Γραφείο Πρακτικής Άσκησης'];
  fontSize: number = 100;
  dateFrom!: string;
  dateTo!: string;
  isDeclarationEnabled!: boolean;
  areOptionsEnabled!: boolean;
  public comment: any;
  departments!: Department[];
  fetchedUsers: any;
  academicsNames: any = [];
  @ViewChild('allUserRolesTable') table: ElementRef | undefined;

  constructor(public studentsService: StudentsService, private router: Router, private route: ActivatedRoute, private chRef: ChangeDetectorRef,
    public authService: AuthService, public translate: TranslateService, public dialog: MatDialog, public adminService: AdminService) {

    translate.addLangs(['en', 'gr']);
    translate.setDefaultLang('gr');

    const browserLang = localStorage.getItem('language') || null;
    translate.use((browserLang != null) ? browserLang : 'gr');
  }

  async ngOnInit() {
    this.studentsService.getAtlasInstitutions()
      .subscribe((fetchedDepartments: Department[]) => {
        this.departments = fetchedDepartments;
      });

    this.adminService.getUsersWithRoles()
      .subscribe((fetchedUsers: any) => {
        this.fetchedUsers = fetchedUsers;

        this.chRef.detectChanges();

        // Use of jQuery DataTables
        const table: any = $('#allUserRolesTable');
        this.table = table.DataTable({
          lengthMenu: [
            [5, 10, 25, -1],
            [5, 10, 25, 'All']
          ],
          lengthChange: true,
          paging: true,
          searching: true,
          ordering: true,
          info: true,
          autoWidth: false,
          responsive: true,
          select: true,
          pagingType: 'full_numbers',
          processing: true,
          columnDefs: [{ orderable: false, targets: [3, 4] }]
        });
      });

    if (!environment.production) {
      this.authService.setSessionId(1);
    }

    if (this.router.url.includes('/admin/login')) {
      this.route.queryParams
        .subscribe(params => {
          this.authService.setToken(params['token']);
          this.authService.setSessionId(params['uuid']);
        }
      );

      this.router.navigate(['/admin/' + this.authService.getSessionId()]);
    }
  }

  checkIfEmpty(fieldValue: any) {
    if (Array.isArray(fieldValue)) {
      if (fieldValue.length === 0) {
        Swal.fire({
          title: 'Υποχρεωτικά πεδία',
          text: 'Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία',
          icon: 'warning',
          confirmButtonText: 'Εντάξει'
        });
        return false;
      }
    }

    else if (fieldValue.trim().length === 0 || fieldValue == null) {
      Swal.fire({
        title: 'Υποχρεωτικά πεδία',
        text: 'Παρακαλώ συμπληρώστε όλα τα απαιτούμενα πεδία',
        icon: 'warning',
        confirmButtonText: 'Εντάξει'
      });
      return false;
    }
    return true;
  }

  submitForm(form: any) {
    const formfieldsValues= [this.username?.value, this.roles?.value, this.academics?.value]
    // loop in formfieldsValues and check if any of them are empty using this.checkIfEmpty
    for (let i = 0; i < formfieldsValues.length; i++) {
      const result = this.checkIfEmpty(formfieldsValues[i]);
      if (!result) return;
    }

    const value = this.academics?.value;
    let academicsArray = [];

    if (Array.isArray(value)) {
      // get academic.atlas_id from this.academics.values array by using this.departments array
      for (let obj of this.academics?.value) {
        const department_ids = this.departments?.find(x => x.department === obj)?.atlas_id;
        academicsArray.push(department_ids);
      }
    } else {
      const department_id = this.departments?.find(x => x.department === value)?.atlas_id;
      academicsArray.push(department_id);
    }

    // alert( Array.isArray(this.academics?.value));

    // this.isAdmin?.value == true ? true : false below: because if the checkbox is not checked, it returns null
    let finalJson = {
      "username": this.username?.value,
      "academics": academicsArray,
      "user_role": this.roles?.value,
      "is_admin": this.isAdmin?.value == true ? true : false
    };
    // console.log(finalJson);

    // call insert roles which Send finalJson to backend via http post to create a new user
    this.onSuccess(finalJson);
  }

  openDialog(userId: number) {
    this.dialog.open(DepartmentsPreviewDialogComponent, {
      data: { departments: this.departments, userId: userId }
    });
  }

  onLogout() {
    this.authService.logout();
  }

  //make a swal2 alert dialog
  onSuccess(finalJson: any) {
    Swal.fire({
      title: 'Εισαγωγή Ρόλου',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην απόδοση ρόλου στον χρήστη;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
        if (!result.isConfirmed) {
          console.log("User pressed Cancel or closed the popup");
        } else {
          this.adminService.insertRoles(finalJson);
        }
    });
  }

  changeFont(operator: string) {
    operator === '+' ? this.fontSize += 10 : this.fontSize -= 10; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    if (this.fontSize >= 200) this.fontSize = 200;
    else if (this.fontSize <= 70) this.fontSize = 70;

    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  resetFont() {
    this.fontSize = 100; (document.getElementById('content-wrapper'))!.style.fontSize = `${this.fontSize}%`;
    document.getElementById('fontSizeSpan')!.innerHTML = `${this.fontSize}%`;
  }

  deleteRole(userId: number) {
    Swal.fire({
      title: 'Διαγραφή Ρόλου',
      text: 'Είστε σίγουροι ότι θέλετε να προχωρήσετε στην διαγραφή ρόλου;',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ΟΚ'
    }).then((result) => {
        if (!result.isConfirmed) {
          console.log("User pressed Cancel");
        } else {
          this.adminService.deleteRolesByUserId(userId);
        }
    });
  }

}

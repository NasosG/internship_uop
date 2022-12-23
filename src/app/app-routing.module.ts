import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentManagerComponent } from './department-managers/department-manager/department-manager.component';
import { HomeComponent } from './home-screen/home/home.component';
import { StudentComponent } from './students/student/student.component';
import { CompanyComponent } from './companies/company/company.component';
import { OfficeComponent } from './internship-office/office/office.component';
import { AdminPanelComponent } from './admin-panels/admin-panel/admin-panel.component';
import {AdminPanelLoginComponent} from './admin-panels/admin-panel-login/admin-panel-login.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent
},
{
  path: 'terms',
  component: HomeComponent
},
{
  path: 'company-terms',
  component: HomeComponent
},
{
  path: 'credentials-generic',
  component: HomeComponent
},
{
  path: 'credentials-generic-signup',
  component: HomeComponent
},
{
  path: 'password-reset',
  component: HomeComponent
},
{
  path: 'student',
  children: [{
    path: ':id',
    component: StudentComponent
  },
  {
    path: 'login/:token/:uuid',
    component: StudentComponent
  },
  {
    path: 'profile/:id',
    component: StudentComponent
  },
  {
    path: 'enable_intern/:id',
    component: StudentComponent
  },
  {
    path: 'myinternship/:id',
    component: StudentComponent
  },
  {
    path: 'company-accept/:id',
    component: StudentComponent
  },
  {
    path: 'positions/:id',
    component: StudentComponent
  },
  {
    path: 'about',
    component: StudentComponent
  },
  {
    path: 'manuals',
    component: StudentComponent
  },
  {
    path: 'calendar',
    component: StudentComponent
  },
  {
    path: 'sheets',
    component: StudentComponent,
    children: [
      {
        path: ':id',
        component: StudentComponent
      },
      {
        path: 'input-sheet/:id',
        component: StudentComponent
      },
      {
        path: 'output-sheet/:id',
        component: StudentComponent
      },
      {
        path: 'input-sheet-preview/:id',
        component: StudentComponent
      },
      {
        path: 'evaluation-form/:id',
        component: StudentComponent
      }]
  },
  {
    path: 'student-contract',
    component: StudentComponent
  },
  {
    path: 'contact',
    component: StudentComponent
  }
  ]
},
{
  path: 'department-manager',
  children: [{
    path: ':id',
    component: DepartmentManagerComponent
  },
  {
    path: 'login/:token/:uuid',
    component: DepartmentManagerComponent
  },
  {
    path: 'add-period/:id',
    component: DepartmentManagerComponent
  },
  {
    path: 'edit-period/:id',
    component: DepartmentManagerComponent
  },
  {
    path: 'student-applications',
    component: DepartmentManagerComponent,
    children: [
      {
        path: ':id',
        component: DepartmentManagerComponent
      },
      {
        path: 'results/:id',
        component: DepartmentManagerComponent
      }]
  },
  {
    path: 'sheet-input/:id',
    component: DepartmentManagerComponent,
  },
  {
    path: 'sheet-output/:id',
    component: DepartmentManagerComponent,
  },
  {
    path: 'match-students/:id',
    component: DepartmentManagerComponent
  },
  {
    path: 'contact',
    component: DepartmentManagerComponent
  },
  {
    path: 'about',
    component: DepartmentManagerComponent
  },
  {
    path: 'manuals',
    component: DepartmentManagerComponent
  },
  {
    path: 'students-approved/:id',
    component: DepartmentManagerComponent
  }
  ]
},
{
  path: 'companies',
  children: [{
    path: ':id',
    component: CompanyComponent
  },
  {
    path: 'students-positions',
    component: CompanyComponent,
    children: [
      {
        path: ':id',
        component: CompanyComponent
      },
      {
        path: ':id/upload',
        component: CompanyComponent
      }]
  },
  {
    path: 'students-applications/:id',
    component: CompanyComponent
  },
  {
    path: 'selected-students/:id',
    component: CompanyComponent
  },
  {
    path: 'contact/:id',
    component: CompanyComponent
  },
  {
    path: 'about',
    component: CompanyComponent
  },
  {
    path: 'manuals',
    component: CompanyComponent
  }
  ]
},
{
  path: 'office',
  children: [{
    path: ':id',
    component: OfficeComponent
  },
  {
    path: 'positions-add/:id',
    component: OfficeComponent
  },
  {
    path: 'stats/:id',
    component: OfficeComponent
  },
  {
    path: 'contact',
    component: OfficeComponent
  },
  {
    path: 'about',
    component: OfficeComponent
  },
  {
    path: 'manuals',
    component: OfficeComponent
  },
  {
    path: 'sheet-input/:id',
    component: OfficeComponent,
  },
  {
    path: 'sheet-output/:id',
    component: OfficeComponent,
  },
  ]
},
{
  path: 'admin',
  children: [{
    path: ':id',
    component: AdminPanelComponent
  },
  {
    path: '',
    component: AdminPanelLoginComponent
  },
  {
    path: 'login/:token/:uuid',
    component: AdminPanelComponent
  }]
}

];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }

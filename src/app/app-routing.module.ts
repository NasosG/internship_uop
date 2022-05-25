import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentManagerComponent } from './department-managers/department-manager/department-manager.component';
import { HomeComponent } from './home-screen/home/home.component';
import { StudentComponent } from './students/student/student.component';
import { CompanyComponent } from './companies/company/company.component';

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
  path: 'student',
  children: [{
    path: ':id',
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
    component: StudentComponent
  },
  {
    path: 'input-sheet/:id',
    component: StudentComponent
  },
  {
    path: 'output-sheet',
    component: StudentComponent
  },
  {
    path: 'input-sheet-preview/:id',
    component: StudentComponent
  },
  {
    path: 'evaluation-form',
    component: StudentComponent
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
    path: '',
    component: DepartmentManagerComponent
  },
  {
    path: 'add-period',
    component: DepartmentManagerComponent
  },
  {
    path: 'edit-period',
    component: DepartmentManagerComponent
  },
  {
    path: 'student-applications',
    component: DepartmentManagerComponent
  },
  {
    path: 'match-students',
    component: DepartmentManagerComponent
  },
  {
    path: 'contact',
    component: DepartmentManagerComponent
  }
  ]
},
{
  path: 'companies',
  children: [{
    path: '',
    component: CompanyComponent
  },
  {
    path: 'selected-students',
    component: CompanyComponent
  },
  {
    path: 'edit-period',
    component: CompanyComponent
  },
  {
    path: 'students-applications',
    component: CompanyComponent
  },
  {
    path: 'match-students',
    component: CompanyComponent
  },
  {
    path: 'contact',
    component: CompanyComponent
  }
  ]
}
];
@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }

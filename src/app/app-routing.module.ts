import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student/student.component';

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
    path: '',
    component: StudentComponent
  },
  {
    path: 'profile',
    component: StudentComponent
  },
  {
    path: 'myinternship',
    component: StudentComponent
  },
  { 
    path: 'positions',
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
    path: 'input-sheet',
    component: StudentComponent
  },
  {
    path: 'output-sheet',
    component: StudentComponent
  },
  {
    path: 'input-sheet-preview',
    component: StudentComponent
  }]
},
// {
//   path: 'profile', 
//   component: StudentProfileComponent
// }];
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentComponent } from './student/student.component';

const routes: Routes = [{
  path: '', 
  component: HomeComponent
},
{
  path: 'student', 
  component: StudentComponent
},
{
  path: 'profile', 
  component: StudentProfileComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}

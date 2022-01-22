import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentComponent } from './students/student/student.component';
import { HomeComponent } from './home-screen/home/home.component';
import { StudentProfileComponent } from './students/student-profile/student-profile.component';
import { StudentInternshipComponent } from './students/student-internship/student-internship.component';
import { StudentPositionsComponent } from './students/student-positions/student-positions.component';
import { ManualsComponent } from './students/manuals/manuals.component';
import { AboutComponent } from './students/about/about.component';
import { CalendarComponent } from './students/calendar/calendar.component';
import { StudentHomeComponent } from './students/student-home/student-home.component';
import { SheetsComponent } from './students/sheets/sheets.component';
import { StudentLoginTermsComponent } from './home-screen/student-login-terms/student-login-terms.component';
import { HomeButtonsComponent } from './home-screen/home-buttons/home-buttons.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SheetInputComponent } from './students/sheet-input/sheet-input.component';
import { SheetOutputComponent } from './students/sheet-output/sheet-output.component';
import { SheetInputPreviewComponent } from './students/sheet-input-preview/sheet-input-preview.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CompanyLoginTermsComponent } from './home-screen/company-login-terms/company-login-terms.component';
import { CredentialsGenericLoginComponent } from './home-screen/credentials-generic-login/credentials-generic-login.component';
import { DepartmentManagerComponent } from './department-managers/department-manager/department-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentComponent,
    HomeComponent,
    StudentProfileComponent,
    StudentInternshipComponent,
    StudentPositionsComponent,
    ManualsComponent,
    AboutComponent,
    CalendarComponent,
    StudentHomeComponent,
    SheetsComponent,
    StudentLoginTermsComponent,
    HomeButtonsComponent,
    SheetInputComponent,
    SheetOutputComponent,
    SheetInputPreviewComponent,
    CompanyLoginTermsComponent,
    CredentialsGenericLoginComponent,
    DepartmentManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

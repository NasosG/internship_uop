import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StudentComponent } from './student/student.component';
import { HomeComponent } from './home/home.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { StudentInternshipComponent } from './student-internship/student-internship.component';
import { StudentPositionsComponent } from './student-positions/student-positions.component';
import { ManualsComponent } from './manuals/manuals.component';
import { AboutComponent } from './about/about.component';
import { CalendarComponent } from './calendar/calendar.component';
import { StudentHomeComponent } from './student-home/student-home.component';
import { SheetsComponent } from './sheets/sheets.component';
import { StudentLoginTermsComponent } from './student-login-terms/student-login-terms.component';
import { HomeButtonsComponent } from './home-buttons/home-buttons.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SheetInputComponent } from './sheet-input/sheet-input.component';
import { SheetOutputComponent } from './sheet-output/sheet-output.component';
import { SheetInputPreviewComponent } from './sheet-input-preview/sheet-input-preview.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CompanyLoginTermsComponent } from './company-login-terms/company-login-terms.component';
import { CredentialsGenericLoginComponent } from './credentials-generic-login/credentials-generic-login.component';

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

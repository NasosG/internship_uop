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
    HomeButtonsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatSlideToggleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

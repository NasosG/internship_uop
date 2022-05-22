import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialFileInputModule } from 'ngx-material-file-input';

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
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { SheetInputComponent } from './students/sheet-input/sheet-input.component';
import { SheetOutputComponent } from './students/sheet-output/sheet-output.component';
import { SheetInputPreviewComponent } from './students/sheet-input-preview/sheet-input-preview.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { CompanyLoginTermsComponent } from './home-screen/company-login-terms/company-login-terms.component';
import { CredentialsGenericLoginComponent } from './home-screen/credentials-generic-login/credentials-generic-login.component';
import { DepartmentManagerComponent } from './department-managers/department-manager/department-manager.component';
import { PeriodAddComponent } from './department-managers/period-add/period-add.component';
import { PeriodEditComponent } from './department-managers/period-edit/period-edit.component';
import { DepartmentManagerHeaderComponent } from './department-managers/department-manager-header/department-manager-header.component';
import { StudentApplicationsComponent } from './department-managers/student-applications/student-applications.component';
import { DataTablesModule } from 'angular-datatables';
import { StudentMatchComponent } from './department-managers/student-match/student-match.component';
import { StudentsApplicationsComponent } from './companies/students-applications/students-applications.component';
import { CompanyComponent } from './companies/company/company.component';
import { SelectedStudentsComponent } from './companies/selected-students/selected-students.component';
import { ContactComponent } from './generic-components/contact/contact.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentContractComponent } from './students/student-contract/student-contract.component';
import { SheetInputEditComponent } from './students/sheet-input-edit/sheet-input-edit.component';
import { SheetOutputEditComponent } from './students/sheet-output-edit/sheet-output-edit.component';
import { SheetOutputPreviewComponent } from './students/sheet-output-preview/sheet-output-preview.component';
import { SheetEvaluationComponent } from './students/sheet-evaluation/sheet-evaluation.component';
import { SheetEvaluationEditComponent } from './students/sheet-evaluation-edit/sheet-evaluation-edit.component';
import { SheetEvaluationPreviewComponent } from './students/sheet-evaluation-preview/sheet-evaluation-preview.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { PracticeEnableComponent } from './students/practice-enable/practice-enable.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

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
    PeriodAddComponent,
    PeriodEditComponent,
    DepartmentManagerHeaderComponent,
    StudentApplicationsComponent,
    StudentMatchComponent,
    StudentsApplicationsComponent,
    CompanyComponent,
    SelectedStudentsComponent,
    ContactComponent,
    StudentContractComponent,
    SheetInputEditComponent,
    SheetOutputEditComponent,
    SheetOutputPreviewComponent,
    SheetEvaluationComponent,
    SheetEvaluationEditComponent,
    SheetEvaluationPreviewComponent,
    PracticeEnableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MaterialFileInputModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    MatListModule,
    MatStepperModule,
    MatDialogModule,
    MatSelectModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }

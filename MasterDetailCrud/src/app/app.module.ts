import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';
import { HomeComponent } from './components/common/home/home.component';
import { StudentListComponent } from './components/students/student-list/student-list.component';
import { StudentCreateComponent } from './components/students/student-create/student-create.component';
import { StudentEditComponent } from './components/students/student-edit/student-edit.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatImportModule } from './modules/mat-import/mat-import.module';
import { StudentService } from './services/student.service';
import { DatePipe } from '@angular/common';
import { ResultDialogComponent } from './components/common/result-dialog/result-dialog.component';
import { ConfirmDeleteComponent } from './components/common/confirm-delete/confirm-delete.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    StudentListComponent,
    StudentCreateComponent,
    StudentEditComponent,
    ResultDialogComponent,
    ConfirmDeleteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatImportModule,
    ReactiveFormsModule
  ],
  providers: [
    provideAnimationsAsync(),DatePipe, HttpClient, StudentService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

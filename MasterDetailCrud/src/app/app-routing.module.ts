import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/common/home/home.component';
import { StudentListComponent } from './components/students/student-list/student-list.component';
import { StudentCreateComponent } from './components/students/student-create/student-create.component';
import { StudentEditComponent } from './components/students/student-edit/student-edit.component';
import { NavBarComponent } from '../app/components/common/nav-bar/nav-bar.component';

const routes: Routes = [
  {path:'', component: NavBarComponent},
  {path:'home', component: HomeComponent},
  {path:'students', component: StudentListComponent},
  {path:'student-add', component: StudentCreateComponent},
  {path:'student-edit/:id', component: StudentEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

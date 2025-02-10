import { Component, OnInit, ViewChild } from '@angular/core';
import { Student } from '../../../models/student';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { StudentService } from '../../../services/student.service';
import { NotifyService } from '../../../services/notify.service';
import { MatDialog } from '@angular/material/dialog';
import { Shift } from '../../../models/shift';
import { ResultDialogComponent } from '../../common/result-dialog/result-dialog.component';
import { ConfirmDeleteComponent } from '../../common/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
  imgPath = 'http://localhost:5269/Pictures';
  students:Student[] =[];
  dataSource:MatTableDataSource<Student> = new MatTableDataSource(this.students);
  columns=[ 'picture','studentName', 'shift', 'birthDate', 'tutionFee', 'isPresent','results', 'actions'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private studentSrv:StudentService,
    private notifySrv:NotifyService,
    private matDialog:MatDialog
  ){}
  getShift(v:number){
    return Shift[v];
  }
  showResults(id:number){
    this.matDialog.open(ResultDialogComponent, {
      data:{id:id}
    })
  }
  deleteStudent(data:Student){
    this.matDialog.open(ConfirmDeleteComponent, {
      "width":"350px"

    }).afterClosed()
    .subscribe({
      next: result=>{
        if(result) {
          this.studentSrv.delete(<number>data.studentId)
          .subscribe({
            next: r=>{
              this.dataSource.data = this.dataSource.data.filter(x=> x.studentId != data.studentId);
            }
          })
        }
      }
    })
  }
  ngOnInit(): void {
    this.studentSrv.getAll()
    .subscribe({
      next: r=>{
        this.students=r;
        console.log(this.students)
        this.dataSource.data = this.students;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifySrv.message("Failed to load student", "DISMISS");
        console.log(err.message | err);
      }
    })
  }
}

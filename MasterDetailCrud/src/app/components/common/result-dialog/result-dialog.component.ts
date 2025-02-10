import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../../../services/student.service';
import { Result } from '../../../models/result';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResultData } from '../../../models/result-data';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.css'
})
export class ResultDialogComponent implements OnInit{
  results:Result[] =[];
  dataSource:MatTableDataSource<Result> = new MatTableDataSource(this.results);
  columns=[ 'examName','gpa'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:ResultData,
    private studentSrv :StudentService,
    private notifySrv:NotifyService
  ){}
  ngOnInit(): void {
    this.studentSrv.getResults(<number>this.data.id)
    .subscribe({
      next: r=>{
        console.log(r)
        this.results = r;
        this.dataSource.data = this.results;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifySrv.message("Failed to load Result", "DISMISS");
        console.log(err.message | err);
      }
    })
  }
}
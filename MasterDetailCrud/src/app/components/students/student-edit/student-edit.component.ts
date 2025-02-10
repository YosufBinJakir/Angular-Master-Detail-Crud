import { Component, OnInit } from '@angular/core';
import { Student } from '../../../models/student';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../services/student.service';
import { NotifyService } from '../../../services/notify.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Shift } from '../../../models/shift';
import { Result } from '../../../models/result';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrl: './student-edit.component.css'
})
export class StudentEditComponent implements OnInit {
  student:Student = {};
  typeOptions:{label:string, value:number}[] =[];
  picture:File = null!;
  studentForm:FormGroup = new FormGroup({
    studentName: new FormControl('', Validators.required),
    shift: new FormControl(undefined, Validators.required),
    birthDate: new FormControl(undefined, Validators.required),
    tutionFee:new FormControl(undefined, Validators.required),
    isPresent:new FormControl(undefined),
    picture: new FormControl('', Validators.required),
    results: new FormArray([])
  });
  constructor(
    private studentSrv: StudentService,
    private notifySrv:NotifyService,
    private activatedRoute:ActivatedRoute,
    private datePipe:DatePipe
    
  ){}
  
  get f(){
    return this.studentForm.controls;
  }
  get results(){
    return this.studentForm.controls['results'] as FormArray;
  }
  addResult(result?: Result){
    this.results.push(new FormGroup({
        examName: new FormControl(result?.examName ?? '', Validators.required),
        gpa: new FormControl(result?.gpa ?? '', Validators.required)
    })
  );
  }
  removeResult(index:number){
    this.results.removeAt(index);
  }
  save(){
    if(this.studentForm.invalid) return;
    let data:Student = {};
    Object.assign(data, this.studentForm.value);
    data.studentId=this.student.studentId;
    if(data.picture == ''){
      data.picture = this.student.picture;
    }

    console.log(data);
    this.studentSrv.update(data)
    .subscribe({
      next:r=>{
        this.notifySrv.message("Data Saved", "DISMISS");
      },
      error: err=>{
        this.notifySrv.message("Failed to update", "DISMISS");
      }
    })

  }
  pictureChanged(event:any){
    
    if(event.target.files.length){
      this.picture = event.target.files[0];
      this.studentForm.patchValue({
        picture: this.picture.name
      })
    }
  }
  ngOnInit(): void {
    Object.keys(Shift).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(Shift[v]) });
    });
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.studentSrv.getById(id)
    .subscribe({
      next: r=>{
        this.student= r;
        this.studentForm.patchValue(this.student)
        this.student.results?.forEach(x=>{
          this.addResult(x);
        });
      },
      error: err=>{
        this.notifySrv.message("Failed to save", "DISMISS");
      }
    })
  }
}

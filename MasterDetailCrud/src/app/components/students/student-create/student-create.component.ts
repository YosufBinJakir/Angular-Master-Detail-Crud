import { Component, OnInit } from '@angular/core';
import { Student } from '../../../models/student';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../../../services/student.service';
import { NotifyService } from '../../../services/notify.service';
import { DatePipe } from '@angular/common';
import { Shift } from '../../../models/shift';

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrl: './student-create.component.css'
})
export class StudentCreateComponent implements OnInit{
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
    private datePipe:DatePipe
  ){}
  get f(){
    return this.studentForm.controls;
  }
  get results(){
    return this.studentForm.controls['results'] as FormArray;
  }
  addResult(){
    this.results.push(new FormGroup({
        examName: new FormControl('', Validators.required),
        gpa: new FormControl('', Validators.required)
    })
  );
  }
  removeResult(index:number){
    this.results.removeAt(index);
  }
  save(){
    if(this.studentForm.invalid) return;
    Object.assign(this.student, this.studentForm.value);
    const reader = new FileReader();
    reader.onload = (e:any)=>{
      this.studentSrv.uploadImage(this.picture)
      .subscribe({
        next: r=>{
          this.student.picture = r.newFileName;
          this.insert();
        },
        error: err=>{
          this.notifySrv.message("Failed to upload picture", "DISMISS");
        }
      })
    }
    reader.readAsArrayBuffer(this.picture)
    this.student.birthDate = <string>this.datePipe.transform(this.student.birthDate, "yyyy-MM-dd")
    //console.log(this.device)
   
  }
  insert(){
    this.studentSrv.save(this.student)
    .subscribe({
      next: r=>{
        this.notifySrv.message("Data Saved", "DISMISS");
        this.student={};
        this.studentForm.reset();
        this.studentForm.markAsPristine();
        this.studentForm.markAsUntouched();
      },
      error: err=>{
        this.notifySrv.message("Failed to save", "DISMISS");
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
    this.addResult();
    Object.keys(Shift).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(Shift[v]) });
    });
    console.log(this.typeOptions)
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImageUploadResponse } from '../models/image-upload-response';
import { Observable } from 'rxjs';
import { Student } from '../models/student';
import { Result } from '../models/result';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http:HttpClient) { }
  getAll(): Observable<Student[]>{
    return this.http.get<Student[]>(`http://localhost:5269/api/Students`);
  }
  getResults(id:number): Observable<Result[]>{
    return this.http.get<Result[]>(`http://localhost:5269/api/Students/Results/Of/${id}`);
  }
  getById(id:number):Observable<Student>{
    return this.http.get<Student>(`http://localhost:5269/api/Students/${id}`);
  }
  save(data:Student):Observable<Student>{
    return this.http.post<Student>(`http://localhost:5269/api/Students`, data);
  }
  update(data:Student):Observable<any>{
    return this.http.put<any>(`http://localhost:5269/api/Students/${data.studentId}`, data);
  }
  delete(id:number):Observable<any>{
    return this.http.delete<any>(`http://localhost:5269/api/Students/${id}`);
  }
  uploadImage(f: File): Observable<ImageUploadResponse> {
    const formData = new FormData();

    formData.append('pic', f);
    //console.log(f);
    return this.http.post<ImageUploadResponse>(`http://localhost:5269/api/Students/Image/Upload`, formData);
  }
}

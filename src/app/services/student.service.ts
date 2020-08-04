import { Injectable } from '@angular/core';

import { Student } from '../models/student.model';
import { Observable, throwError, forkJoin } from 'rxjs';
import { map, catchError, retry, tap, shareReplay } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}
  
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private API_PATH = 'API/students';

  constructor(private http: HttpClient) { }

  create(student: Student) {
    /* create student */
    return this.http.post<any>(`${this.API_PATH}`, student)
  }

  update(student: Student): Observable<Student> {
    /* update student */
    return this.http
                .put<Student>(`${this.API_PATH}/${student.id}`, student, httpOptions)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.update error: ${err.message}`);
                  })
                );
  }

  find(studentId: string): Observable<Student> {
    /* find student (by studentId) */
    return this.http
                .get<Student>(`${this.API_PATH}/${studentId}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.queryAll error: ${err.message}`);
                  })
                );
  }

  queryAll(): Observable<Student[]> { 
    /* return students list */
    return this.http
                .get<any>(`${this.API_PATH}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.queryAll error: ${err.message}`);
                  }),
                  map( data => {
                    return data._embedded.studentDTOList
                  })
                )
  }

  queryEnrolled(courseId: string): Observable<Student[]> { 
    /* return enrolled students list (by courseId) */
    return this.http
                .get<Student[]>(`${this.API_PATH}?courseId=${courseId}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.queryAll ${courseId} error: ${err.message}`);
                  }),
                  map( data => {
                    var enrolledStudents: Student[] = [];
                    data.forEach( student => {
                      enrolledStudents.push(new Student(student.id, student.lastName, student.firstName, student.courseId, student.groupId));
                    });
                    return enrolledStudents;
                  })
                )
  }

  delete(studentId: string): Observable<Student[]> {
    /* delete student (by studentId) */
    return this.http
                .delete<Student[]>(`${this.API_PATH}/${studentId}`)
                .pipe(
                  catchError( err => {
                    console.error(err);
                    return throwError(`StudentService.delete ${studentId} error: ${err.message}`);
                })
              );
  }  


  enroll(students: Student[], courseId: string) {
    const requests$ = new Array<Observable<Student>>();

    students.forEach( student => {
      if(student.courseId != courseId) {
        student.courseId = courseId;
        requests$.push(this.update(student));
      }
    });
    
    return forkJoin(requests$);
  }

  unenroll(students: Student[]) {
    const requests$ = new Array<Observable<Student>>();

    students.forEach( student => {
      if(student.courseId != "0") {
        student.courseId = "0";
        requests$.push(this.update(student));
      }
    });
    
    return forkJoin(requests$);
  }

}

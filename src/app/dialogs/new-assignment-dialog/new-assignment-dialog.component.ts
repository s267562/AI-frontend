import { Component, OnInit, OnDestroy, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Assignment } from 'src/app/models/assignment.model';

@Component({
  selector: 'app-new-assignment-dialog',
  templateUrl: './new-assignment-dialog.component.html',
  styleUrls: ['./new-assignment-dialog.component.css']
})
export class NewAssignmentDialogComponent implements OnInit {

  // date(dd/mm/yyyy) when exercise expired and the students can not upload an assignment
  today = new Date()
  tomorrow =  new Date(this.today.setDate(this.today.getDate() + 1));
  expireDate = new FormControl(this.tomorrow)
  
  file: File
  defaultFilename = 'No file chosen'
  filename: string

  fileRequiredError = false
  fileError = false
  errorMessage: string

  error = false

  emitter: EventEmitter<void>

  courseId: string

  constructor(private dialogRef: MatDialogRef<NewAssignmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, private courseService: CourseService) { 
    this.emitter = data.emitter
    this.courseId = data.courseId
  }

  ngOnInit(): void {
    this.filename = this.defaultFilename
  }
  cancel() {
    this.dialogRef.close(false)
  }

  fileChange(files: any) {
    //console.dir("fileChange - files: " + JSON.stringify(files))
    // when the load event is fired and the file not empty
    if(files && files.length > 0) {
      // Fill file variable with the file content
      this.file = files[0]
      this.filename = this.file.name
    }
  }

  addAssignment() {

    if(this.expireDate.invalid) {
      this.expireDate.markAsTouched({onlySelf: true})
    } else if(this.file === null || this.file === undefined) {
      this.fileRequiredError = true
    } else {
      let today = new Date()
      const pickedDate = this.expireDate.value as Date
      if(today >= pickedDate) {
        this.expireDate.setErrors({'invalid': true})
        return
      }
      // all fields are valid
      this.courseService.addAssignment(this.courseId, this.expireDate.value, this.file)
            .subscribe(
              succ => {
                // console.dir("course " + createdCourse.id + " created successfully - owner: " + createdCourse.teacherId)
                this.emitter.emit()
                this.dialogRef.close()
              },
              err => {
                // console.dir("addCourse (error) - err: " + err)
                this.error = true   
              }
            )
    }
  }

  getExpireDateErrorMessage() {
    if (this.expireDate.hasError('required')) {
      return 'Expire Date is required'
    } else if(this.expireDate.hasError('invalid')) {
      return 'Invalid Date: expire date is less or equals then today'
    } else {
      return ''
    }
  }

}

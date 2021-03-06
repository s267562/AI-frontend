import { Component, OnInit, OnDestroy, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { CourseService } from 'src/app/services/course.service';
import { Course } from 'src/app/models/course.model';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-course-dialog',
  templateUrl: './new-course-dialog.component.html',
  styleUrls: ['./new-course-dialog.component.css']
})
export class NewCourseDialogComponent implements OnInit {

  name = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required]
  })

  id = new FormControl('', {
    updateOn: 'blur',
    validators: [Validators.required]
  })

  min = new FormControl('1', {
    validators: [
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]
  })

  max = new FormControl('1', {
    validators: [
      Validators.required,
      Validators.pattern("^[0-9]*$")
    ]
  })

  enabled = false

  teacherId: string

  error = false

  emitter: EventEmitter<void>

  constructor(private dialogRef: MatDialogRef<NewCourseDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, authService: AuthService, private courseService: CourseService) { 
    this.emitter = data.emitter
    this.teacherId = authService.getUserId()
  }

  ngOnInit(): void {
  }

  cancel() {
    this.dialogRef.close(false)
  }

  addCourse() {
    if (!this.id.invalid && !this.name.invalid && !this.min.invalid && !this.max.invalid) { 
      if(this.min.value > this.max.value) {
        /* error in min and max values */
        this.max.setErrors({'invalid': true})
        this.min.setErrors({'invalid': true})
        return
      } 
      /* all fields are valid */
      this.courseService.create(new Course(this.id.value, this.name.value, this.min.value, this.max.value, this.enabled, this.teacherId))
            .subscribe(
              (createdCourse: Course) => {
                // console.dir("course " + createdCourse.id + " created successfully - owner: " + createdCourse.teacherId)
                this.emitter.emit()
                this.dialogRef.close(createdCourse)
              },
              err => {
                // console.dir("addCourse (error) - err: " + err)
                this.error = true   
              }
            )

    } else {
      this.id.markAsTouched({onlySelf: true})
      this.name.markAsTouched({onlySelf: true})
      this.min.markAsTouched({onlySelf: true})
      this.max.markAsTouched({onlySelf: true})
    }
  }

  getIdErrorMessage() {
    if (this.id.hasError('required')) {
      return 'Id is required'
    } else {
      return ''
    }
  }

  getNameErrorMessage() {
    if (this.name.hasError('required')) {
      return 'Name is required'
    } else {
      return ''
    }
  }

  getMinErrorMessage() {
    if (this.min.hasError('required')) {
      return 'Min is required'
    }  else if (this.max.hasError('pattern')) {
      return 'Min is a number!'
    } else return 'min <= max'
  }

  getMaxErrorMessage() {
    if (this.max.hasError('required')) {
      return 'Max is required'
    } else if (this.max.hasError('pattern')) {
      return 'Max is a number!'
    } else return 'max >= min'
  }

}

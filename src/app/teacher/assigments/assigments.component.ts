import { Component, OnInit } from '@angular/core';
import { Assignment } from 'src/app/models/assignment.model';
import { Paper } from 'src/app/models/paper.model';
import { Student } from 'src/app/models/student.model';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-assigments',
  templateUrl: './assigments.component.html',
  styleUrls: ['./assigments.component.css']
})
export class AssigmentsComponent implements OnInit {
  
  assignments: Assignment[] = [
    new Assignment("A0",  "01/01/2020", "31/01/2020"), 
    new Assignment("A1",  "01/03/2020", "31/03/2020"), 
    new Assignment("A2",  "01/05/2020", "31/05/2020")
  ]

  papers = new Map<string, Paper[]>([
    ["A0", [ new Paper("P0", new Student("902030", "260342", "Andrea", "Rossi"), "NULL", "15/01/2020"),
             new Paper("P1", new Student("902030", "260342", "Francesco", "Verdi"), "NULL", "10/01/2020"),
             new Paper("P2", new Student("902030", "260342", "Stefano", "Gialli"), "NULL", "12/01/2020") ]],
    ["A1", [ new Paper("P01", new Student("902030", "260342", "Andrea", "Rossi"), "NULL", "15/03/2020"),
             new Paper("P02", new Student("902030", "260342", "Francesco", "Verdi"), "READ", "10/03/2020"),
             new Paper("P03", new Student("902030", "260342", "Stefano", "Gialli"), "READ", "12/03/2020") ]],
    ["A2", [ new Paper("P11", new Student("902030", "260342", "Andrea", "Rossi"), "NULL", "15/05/2020"),
             new Paper("P12", new Student("902030", "260342", "Francesco", "Verdi"), "NULL", "10/05/2020") ]],
  ]) 

  // select last assignment as default
  selectedAssignment: string = this.assignments[this.assignments.length-1].id 

  dataSource: MatTableDataSource<Paper>

  colsToDisplay = ['name', 'firstName', 'serial', 'status', 'statusDate']

  constructor() { 
    this.dataSource = new MatTableDataSource<Paper>(this.papers.get(this.selectedAssignment))
  }

  ngOnInit(): void {
  }

  onSelectChange() {
    //console.dir("this.selectedAssignment: " + this.selectedAssignment)
    this.dataSource = new MatTableDataSource<Paper>(this.papers.get(this.selectedAssignment))
  }

  filter() {

  }

}

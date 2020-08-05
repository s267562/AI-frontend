import {Component, OnInit, ViewChild} from '@angular/core';
import {GroupService} from '../../services/group.service';
import {Group, TEST_GROUP} from '../../models/group.model';
import {SelectionModel} from '@angular/cdk/collections';
import {Student} from '../../models/student.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl} from '@angular/forms';
import * as moment from 'moment';
import {MatAccordion} from '@angular/material/expansion';
import { StudentService } from 'src/app/services/student.service';
import { Resources } from 'src/app/models/resources.model';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

    group: Group = null;
    selectionModel: SelectionModel<Student> = new SelectionModel<Student>(true, []);
    dataSource: MatTableDataSource<Student>;
    colsToDisplay = ['select'].concat('id', 'lastName', 'firstName');
    proposedGroupName = new FormControl();
    expiryProposal = new FormControl();
    proposals = [TEST_GROUP, TEST_GROUP];

    @ViewChild(MatSort, {static: true}) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('vmsAccordion') accordion: MatAccordion;

    constructor(private groupService: GroupService, private studentService: StudentService) {
    }

    ngOnInit(): void {
        this.initStudentGroup();
        this.initStudentsWithoutGroup();

    }

    openAll() {
        this.accordion.openAll();
    }

    closeAll() {
        this.accordion.closeAll();
    }

    initStudentGroup() {
        this.studentService.getTeamByCourse("s1", "p").subscribe((group: Group) => {
            this.groupService.getMembers(group.id).subscribe((members: Student[]) => {
                group.members = members
                this.groupService.getResources(group.id).subscribe((resources: Resources) => {
                    group.resources = resources
                    this.group = group
                })
            })
        })
    }

    initStudentsWithoutGroup() {
        /*this.courseService.queryAvailableStudents("").subscribe(data => {
            this.dataSource = new MatTableDataSource<Student>(data);
            this.dataSource.paginator = this.paginator;
        });*/
    }

    toggleTableRow(event: MatCheckboxChange, row: Student) {
        const ret = this.selectionModel.toggle(row);
        return ret;
    }

    proposeGroup() {
        console.log(this.proposedGroupName.value);
        console.log(this.expiryProposal.value);
    }

    disableProposalForm() {
        // Return true if proposal button need to be disabled
        return this.proposedGroupName.value === null || this.proposedGroupName.value === '' || this.selectionModel.selected.length === 0 || this.expiryProposal === null
            || this.expiryProposal.value === '' || !moment(this.expiryProposal.value, 'YYYY-MM-DD', true).isValid();
    }

}

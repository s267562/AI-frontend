import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, of, throwError} from 'rxjs';
import {Vm} from '../models/vm.model';
import {catchError, map} from 'rxjs/operators';
import {Student} from '../models/student.model';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

@Injectable({
    providedIn: 'root'
})
export class VmService {

    private API_PATH = 'API/virtual-machines';

    constructor(private http: HttpClient) {
    }

    getVmOwners(vmID: string): Observable<Student[]> {
        return this.http
            .get<any>(`${this.API_PATH}/${vmID}/owners`)
            .pipe(catchError(err => {
                    console.error(err);
                    return throwError(`VmService.getVmOwners error: ${err.message}`);
                }),
                map(data => {
                    let owners: Student[] = [];
                    if (data !== undefined && data._embedded !== undefined) {
                        data._embedded.studentList.forEach((studentData: any) => {
                            let stud = new Student(studentData.id, studentData.lastName, studentData.firstName, studentData.email);
                            owners.push(stud);
                        });
                    }
                    return owners;
                }));
    }

    createNewVm(num_vcpu: number, ram: number, disk_space: number, creatorId: string, teamId: string, modelId: string): Observable<Vm> {
        return this.http.post<any>(`${this.API_PATH}`, {
            'num_vcpu': num_vcpu,
            'disk_space': disk_space,
            'ram': ram,
            'studentId': creatorId,
            'teamId': teamId,
            'modelId': modelId
        }, httpOptions).pipe(catchError(err => {
            console.error(err);
            return throwError(`VmService.createNewVm error: ${err.message}`);
        }));

    }


}

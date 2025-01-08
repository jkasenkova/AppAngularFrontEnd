import { Component, inject, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { ColDef } from 'ag-grid-community';
import { EditButtonComponent } from './editButtonComponent';
import { DeleteButtonComponent } from './deleteButtonComponent';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from './user-dialog/create-user/create-user-dialog.component';
import { UserType } from '@models/userType';
import { UserModel } from '@models/user';
import { ShiftPatternType } from '@models/shiftPatternType';
import { RotationType } from '@models/rotationType';
import { IconComponent } from './iconComponent';
import { UserService } from '@services/userService';
import { map, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { UserView } from './model/userView';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [AgGridAngular, MatButtonModule, AsyncPipe],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.less']
})
export class UserManagementComponent implements OnInit {
    public paginationPageSize = 10;
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    readonly dialog = inject(MatDialog);

    users$: Observable<UserView[]>;
    t: UserView[];
    noRowsDisplay: string = "No users to show";

    colDefs: Observable<ColDef[]> = of([
        {
            field: "icon",
            headerName: "",
            width: 60,
            resizable: false,
            cellRenderer: IconComponent 
        },
        {
            field: "userName",
            headerName: "User Name",
            width: 160,
            resizable: false,
            cellClass: "line-col"
        },
        {
            field: "location",
            headerName: "Location",
            width: 160,
            resizable: false,
            cellClass: "line-col"
        },
        {
            field: "team",
            headerName: "Team",
            width: 155,
            resizable: false
        },
        {
            field: "role",
            headerName: "Role",
            width: 150,
            resizable: false
        },
        {
            field: "userType",
            headerName: "User Type",
            width: 150,
            resizable: false
        },
        {
            field: "rotation",
            headerName: "Rotation",
            width: 130,
            resizable: false
        },
        {
            field: "lastLogin",
            headerName: "Last Login",
            width: 120,
            resizable: false
        },
        {
            field: "actions",
            headerName: "",
            width: 100,
            resizable: false,
            cellRenderer: EditButtonComponent 
        },
        {
            field: "actions",
            headerName: "",
            width: 105,
            resizable: false,
            cellRenderer: DeleteButtonComponent 
        }
    ]);

    constructor(
        private userService: UserService) {}

    ngOnInit(): void {
        this.users$ = this.userService.getUsers().pipe(map((users: UserModel[]) => {

            return users.map((user: UserModel) => {
                const view: UserView = {
                    location: 'Test',
                    userName: user.firstName + ' ' + user.lastName,
                    team: user.teamId,
                    email: user.email,
                    role: user.roleId,
                    userType: UserType.User, 
                    rotation: RotationType.Shift, 
                    lastLogin: new Date().getFullYear() 
                };
                return view;
            });
        }));
    }

    addUser(){
        const dialogRef = this.dialog.open(CreateUserDialogComponent, { 
            data: {},
            panelClass: 'user-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
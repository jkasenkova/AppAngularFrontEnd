import { Component, inject, OnInit } from "@angular/core";
import { AgGridAngular } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { ColDef } from "ag-grid-community";
import { EditButtonComponent } from "./editButtonComponent";
import { DeleteButtonComponent } from "./deleteButtonComponent";
import { MatDialog } from '@angular/material/dialog';
import { CreateUserDialogComponent } from "./user-dialog/create-user/create-user-dialog.component";
import { Team } from "src/app/models/team";
import { Guid } from "guid-typescript";
import { RoleModel } from "src/app/models/role";
import { UserType } from "src/app/models/userType";
import { UserModel } from "./model/userModel";
import { RotationType } from "../user-orientation/model/rotationType";
import { ShiftPatternType } from "src/app/models/shiftPatternType";

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [AgGridAngular, MatButtonModule],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.less']
})
export class UserManagementComponent implements OnInit {
    public paginationPageSize = 10;
    public paginationPageSizeSelector: number[] | boolean = [10, 20, 50, 100];
    readonly dialog = inject(MatDialog);

    colDefs: ColDef[] = [
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
            width: 170,
            resizable: false,
            cellClass: "line-col"
        },
        {
            field: "team",
            headerName: "Team",
            width: 150,
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
            width: 150,
            resizable: false
        },
        {
            field: "lastLogin",
            headerName: "Last Login",
            width: 150,
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
    ];

    teamList: Team[] = [
        {
            teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862"),
            teamName: "Team 1",
            locationId: Guid.parse("d0b2ca1a-d8b9-4a61-bf61-a17e100fbe74")
        },
        {
            teamId: Guid.parse("ac054901-2994-41fd-8e10-197ddcc7d130"),
            teamName: "Team 2",
            locationId: Guid.parse("4e1b1366-4be3-4dc1-8631-fee17c5076b8")
        },
        {
            teamId: Guid.parse("050945b1-2a70-4c24-b865-5506c67dc46a"),
            teamName: "Team 3",
            locationId: Guid.parse("aad6d83c-3146-46ec-8264-1da22de20de4")
        }
    ];

    roleList: RoleModel[] = [
        {
            roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
            roleName: "Team Lead",
            locationId: Guid.parse("d0b2ca1a-d8b9-4a61-bf61-a17e100fbe74"),
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            userType: UserType.Administrator,
            rotationType: RotationType.NoRotation,
            teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862")
        },
        {
            roleId: Guid.parse("1d1a6dd5-7b7a-4084-909d-36a25b4e1294"),
            roleName: "Developers",
            locationId: Guid.parse("4e1b1366-4be3-4dc1-8631-fee17c5076b8"),
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            userType: UserType.User,
            rotationType: RotationType.Shift,
            shiftPatternType: ShiftPatternType.hours12,
            teamId: Guid.parse("ac054901-2994-41fd-8e10-197ddcc7d130")
        },
        {
            roleId: Guid.parse("0bd64997-a753-445c-b62a-5276b01cbe62"),
            roleName: "Sales",
            locationId: Guid.parse("4e1b1366-4be3-4dc1-8631-fee17c5076b8"),
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            userType: UserType.User,
            rotationType: RotationType.Shift,
            shiftPatternType: ShiftPatternType.hours8,
            teamId: Guid.parse("050945b1-2a70-4c24-b865-5506c67dc46a")
        }
    ];

    lineManagersList: UserModel[] = [
        {
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            userName: "User A",
            userSurname: "Bell",
            email: "bell_userA@gmail.com",
            password: "HgBx9TR227Tu",
            roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
            teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862"),
            lineManagerId: Guid.parse("66206dbc-be15-4b7d-84ed-6d8eb7ae0354")
        },
        {
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            userName: "User B",
            userSurname: "Hansley",
            email: "hansley_userB@gmail.com",
            password: "anV7pHhgS2ta",
            roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
            teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862"),
            lineManagerId: Guid.parse("66206dbc-be15-4b7d-84ed-6d8eb7ae0354")
        },
        {
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            userName: "User C",
            userSurname: "Marley",
            email: "marley_userC@gmail.com",
            password: "8PuyxcSSvhYk",
            roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
            teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862"),
            lineManagerId: Guid.parse("66206dbc-be15-4b7d-84ed-6d8eb7ae0354")
        }
    ];

    rowData = [
        { userName: "User A", location: "Ukraine", team: "Team 1", role:"Team Lead", 
            userType: "Admin", rotation:"No Rotation", lastLogin: "20/08/2024", editable: true},
        { userName: "User B", location: "USA", team: "Team 2",role:"developer", 
            userType: "User", rotation:"Shift", lastLogin: "20/08/2024", editable: true},
        { userName: "User C", location: "Moldova", team: "Team 3",role:"sales",
            userType: "User", rotation:"Shift", lastLogin: "20/08/2024", editable: true}
    ];

    ngOnInit(): void {
    }

    addUser(){
        const dialogRef = this.dialog.open(CreateUserDialogComponent, { 
            data: { 
                lineManagers: this.lineManagersList,
                roles: this.roleList,
                teams: this.teamList,
                contributors: this.lineManagersList
            },
            panelClass: 'user-dialog',
            height: '600px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
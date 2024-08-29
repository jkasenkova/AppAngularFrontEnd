import { Component, inject, OnInit } from "@angular/core";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CreateLocationDialogComponent } from "./location-dialog/create-location/create-location.component";
import { LocationModel} from "./model/locationModel";
import { Guid } from "guid-typescript";
import { EditLocationDialogComponent } from "./location-dialog/edit-location/edit-location.component";
import { DeleteLocationDialogComponent } from "./location-dialog/delete-location/delete-location.component";
import { Team } from "src/app/models/team";
import { EditTeamDialogComponent } from "./team-dialog/edit-team/edit-team.component";
import { DeleteTeamDialogComponent } from "./team-dialog/delete-team/delete-team.component";
import { CreateTeamDialogComponent } from "./team-dialog/create-team/create-team.component";
import { CreateRoleDialogComponent } from "./role-dialog/create-role/create-role.component";
import { UserType } from "src/app/models/userType";
import { RoleModel } from "src/app/models/role";
import { EditRoleDialogComponent } from "./role-dialog/edit-role/edit-role.component";
import { DeleteRoleDialogComponent } from "./role-dialog/delete-role/delete-role.component";
import { RotationType } from "./model/rotationType";
import { ShiftPatternType } from "src/app/models/shiftPatternType";

@Component({
    selector: 'app-user-orientation',
    standalone: true,
    imports: [NgbTooltipModule, MatButtonModule],
    templateUrl: './user-orientation.component.html',
    styleUrls: ['./user-orientation.component.less']
})
export class UserOrientationComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    locations: LocationModel[];
    teams: Team[] = [];
    selectedLocation: LocationModel;
    selectedTeam: Team;
    roles: RoleModel[];

    locationListTemp: LocationModel[] = [
        {
            id: Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4"),
            name: "Ukraine",
            timeZoneId: "0aaceca4-4036-4e08-a30d-72a36da93db0"
        },
        {
            id: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            name: "London",
            timeZoneId: "e27aa77e-09ab-48e1-a3fa-59dbe94f5d7c"
        },
    ];

    teamsListTemp: Team[] = [
        {
            teamId: Guid.parse("30a4557f-9e58-4f66-96db-2c2ffbcf5587"),
            teamName : "Team 1",
            locationId:  Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4")
        },
        {
            teamId: Guid.parse("f8a1c4e2-a557-4958-8d99-b9a86963e76e"),
            teamName : "Team 2",
            locationId:  Guid.parse("d5e65215-09a4-4d28-842d-25995018860c")
        }
    ]

    roleList: RoleModel[] = [
        {
            roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
            roleName: "Team Lead",
            locationId: Guid.parse("d0b2ca1a-d8b9-4a61-bf61-a17e100fbe74"),
            userType: UserType.Administrator,
            rotationType: RotationType.NoRotation,
            teamId: Guid.parse("30a4557f-9e58-4f66-96db-2c2ffbcf5587")
        },
        {
            roleId: Guid.parse("1d1a6dd5-7b7a-4084-909d-36a25b4e1294"),
            roleName: "Developers",
            locationId: Guid.parse("4e1b1366-4be3-4dc1-8631-fee17c5076b8"),
            templateId: Guid.parse("92e15cb3-e13d-4c02-8622-483ac0bf89c2"),
            userType: UserType.User,
            rotationType: RotationType.Shift,
            shiftPatternType: ShiftPatternType.hours12,
            teamId: Guid.parse("30a4557f-9e58-4f66-96db-2c2ffbcf5587")
        },
        {
            roleId: Guid.parse("0bd64997-a753-445c-b62a-5276b01cbe62"),
            roleName: "Sales",
            locationId: Guid.parse("4e1b1366-4be3-4dc1-8631-fee17c5076b8"),
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            userType: UserType.User,
            rotationType: RotationType.Shift,
            shiftPatternType: ShiftPatternType.hours8,
            teamId: Guid.parse("f8a1c4e2-a557-4958-8d99-b9a86963e76e")
        }
    ];

    ngOnInit(): void {
        this.locations = this.locationListTemp;
    }

    selectLocation(location:LocationModel){
        this.selectedLocation = location;

        this.teams = this.teamsListTemp.filter(t => t.locationId.toString() == location.id.toString());
        this.roles = [];
    }

    selectTeam(team: Team){
        this.selectedTeam = team;
        this.roles =  this.roleList.filter(r => r.teamId.toString() == team.teamId.toString());
    }

    addLocation() {
        const dialogRef = this.dialog.open(CreateLocationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    removeLocation(location: LocationModel){
        const dialogRef = this.dialog.open(DeleteLocationDialogComponent, { 
            data: { 
                name: location.name,
                id: location.id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    editLocation(location: LocationModel){
        const dialogRef = this.dialog.open(EditLocationDialogComponent, { 
            data: { 
                name: location.name,
                id: location.id,
                address: location.address,
                mapLink: location.mapLink,
                timeZoneId: location.timeZoneId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    addTeam(locationId: Guid){
        const dialogRef = this.dialog.open(CreateTeamDialogComponent, { 
            data: { 
                locationId: locationId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    removeTeam(team: Team){
        const dialogRef = this.dialog.open(DeleteTeamDialogComponent, { 
            data: { 
                teamName: team.teamName,
                teamId:team.teamId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    editTeam(team: Team){
        const dialogRef = this.dialog.open(EditTeamDialogComponent, { 
            data: { 
                teamName: team.teamName,
                teamId:team.teamId,
                locationId:team.locationId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    addRole(teamId: Guid, locationId: Guid){
        const dialogRef = this.dialog.open(CreateRoleDialogComponent, { 
            data: { 
                teamId: teamId,
                locationId: locationId,
                userType: UserType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    editRole(role: RoleModel){
        const dialogRef = this.dialog.open(EditRoleDialogComponent, { 
            data: { 
                roleName: role.roleName,
                teamId: role.teamId,
                locationId: role.locationId,
                templateName: "Template for Role",
                userType: role.userType,
                roleId: role.roleId,
                rotationType: role.rotationType,
                templateId: role.templateId,
                shiftPatternType: role.shiftPatternType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    removeRole(role: RoleModel){
        const dialogRef = this.dialog.open(DeleteRoleDialogComponent, { 
            data: { 
                roleName: role.roleName,
                roleId: role.roleId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}
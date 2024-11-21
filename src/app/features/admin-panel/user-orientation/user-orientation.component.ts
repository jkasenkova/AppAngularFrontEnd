import { Component, inject, OnInit } from "@angular/core";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CreateLocationDialogComponent } from "./location-dialog/create-location/create-location.component";
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
import { LocationModel } from "../../../models/locationModel";
import { LocationService } from "src/app/services/locationService";
import { RoleService } from "src/app/services/roleService";
import { TeamService } from "src/app/services/teamServices";
import { Location } from "src/app/models/location";

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

    constructor(
        private locationService: LocationService,
        private teamService: TeamService,
        private roleService: RoleService) {}

    ngOnInit(): void {
        this.locationService.getLocations().subscribe(locations => 
            this.locations = locations
        );
    }

    selectLocation(location:LocationModel){
        this.selectedLocation = location;
        this.locationService.getTeamsByLocationId(location.id).subscribe(teams => 
            this.teams = teams
        );

        this.teams = this.teams.filter(t => t.locationId == location.id);
        this.roles = [];
    }

    selectTeam(team: Team){
        this.selectedTeam = team;

        this.roleService.getRolesByTeamId(team.id).subscribe(roles => 
            this.roles = roles
        );
    }

    addLocation() {
        const dialogRef = this.dialog.open(CreateLocationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                debugger;
                var location: Location = {
                    name: result.name,
                    timeZoneId: result.timeZoneId,
                    mapLink: result.result,
                    address: result.address
                };

                this.locationService.createLocation(location).subscribe(location =>{
                    this.locations.push(location);
                });
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
                this.locationService.deleteLocation(result.id);
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
                this.locationService.updateLocation(result);
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
                this.teamService.createTeam(result);
            }
        });
    }

    removeTeam(team: Team){
        const dialogRef = this.dialog.open(DeleteTeamDialogComponent, { 
            data: { 
                name: team.name,
                id:team.id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamService.deleteTeam(result.id);
            }
        });
    }

    editTeam(team: Team){
        const dialogRef = this.dialog.open(EditTeamDialogComponent, { 
            data: { 
                name: team.name,
                id: team.id,
                locationId:team.locationId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.teamService.updateTeam(result);
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
                debugger;
                this.roleService.createRole(result);
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
                this.roleService.updateRole(result);
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
                debugger;
                this.roleService.deleteRole(result.roleId);
            }
        });
    }
}
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
import { Template } from "src/app/models/template";
import { TemplateService } from "src/app/services/templateService";

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
        private templateService: TemplateService,
        private roleService: RoleService) {}

    ngOnInit(): void {
        this.locationService.getLocations().subscribe(locations => {
            this.locations = locations.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    selectLocation(location:LocationModel){
        this.selectedLocation = location;
        this.locationService.getTeamsByLocationId(location.id).subscribe(teams => 
        {
                this.teams = teams.sort((a, b) => a.name.localeCompare(b.name));
                this.teams = this.teams.filter(t => t.locationId == location.id);
        });
        this.roles = [];
    }

    selectTeam(team: Team){
        this.selectedTeam = team;

        this.teamService.getRolesByTeamId(team.id).subscribe(roles => 
        {
            this.roles = roles.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    addLocation() {
        const dialogRef = this.dialog.open(CreateLocationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var location: Location = {
                    name: result.name,
                    timeZoneId: result.timeZoneId,
                    mapLink: result.result,
                    address: result.address,
                    isAccountLocation: false
                };

                this.locationService.createLocation(location).subscribe(location =>{
                    this.locations.push(location);
                    this.locations = this.locations.sort((a, b) => a.name.localeCompare(b.name));
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
                this.locationService.deleteLocation(location.id);
                this.locations = this.locations.filter(l=>l.id != location.id);
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
                timeZoneId: location.timeZoneId,
                isAccountLocation: location.isAccountLocation
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var locationUpdate: Location = {
                    id: result.id,
                    name: result.name,
                    timeZoneId: result.timeZoneId,
                    mapLink: result.result,
                    address: result.address,
                    isAccountLocation: result.isAccountLocation
                };

                this.locationService.updateLocation(locationUpdate);

                let updateLocation = this.locations.find(l=> l.id == result.id);
                let index = this.locations.indexOf(updateLocation);
                this.locations[index] = locationUpdate;

                this.locations = this.locations.sort((a, b) => a.name.localeCompare(b.name));
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
                var team: Team = {
                    id: Guid.create(),
                    name: result.teamName,
                    locationId: locationId
                };
                this.teamService.createTeam(team);
                this.teams.push(team);

                this.teams = this.teams.sort((a, b) => a.name.localeCompare(b.name));
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
                this.teamService.deleteTeam(result.teamId);
                this.teams = this.teams.filter(l=>l.id != team.id);
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
                let updateTeam = this.teams.find(l=> l.id == team.id);
                let index = this.teams.indexOf(updateTeam);
                this.teams[index].name = result.name;

                this.teams = this.teams.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }

    addRole(teamId: Guid, locationId: Guid){
        const dialogRef = this.dialog.open(CreateRoleDialogComponent, { 
            data: { 
                teamId: teamId,
                userType: UserType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var templateId: any;
                debugger;
                if(result.template){
                    if(result.template.id != null){
                        templateId = result.template.id;
                    }else{
                        var id = Guid.create();
                        templateId = this.createTemplate(result.template, id);
                    }
                }

                var role: RoleModel = {
                    id: Guid.create(),
                    name: result.name,
                    userType: result.userType,
                    teamId: result.teamId,
                    rotationType: result.rotationType,
                    shiftPatternType: result.shiftPatternType,
                    templateId: templateId
                };

                this.roleService.createRole(role);
                this.roles.push(role);
                this.roles = this.roles.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }

    createTemplate(nameTemplate: string, id: any): Guid{

        var newTemplate: Template = {
            name: nameTemplate,
            id: id.value,
            isHandover: false
        };

        this.templateService.addTemplate(newTemplate);

        return newTemplate.id;
    }

    editRole(role: RoleModel){
        const dialogRef = this.dialog.open(EditRoleDialogComponent, { 
            data: {
                id: role.id,
                name: role.name,
                templateId: role.templateId,
                userType: role.userType,
                teamId: role.teamId,
                rotationType: role.rotationType,
                shiftPatternType: role.shiftPatternType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var templateId: any;

                if(result.template.id != null){
                    templateId = result.template.id;
                }else{
                    var id = Guid.create();
                    templateId = this.createTemplate(result.template, id);
                }
                
                var updRole: RoleModel = {
                    id: result.id,
                    name: result.name,
                    userType: result.userType,
                    teamId: result.teamId,
                    rotationType: result.rotationType,
                    shiftPatternType: result.shiftPatternType,
                    templateId: templateId
                };

                this.roleService.updateRole(updRole);

                let updateRole = this.roles.find(t=> t.id == role.id);
                let index = this.roles.indexOf(updateRole);
                this.roles[index] = updRole;

                this.roles = this.roles.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }

    removeRole(role: RoleModel){
        const dialogRef = this.dialog.open(DeleteRoleDialogComponent, { 
            data: { 
                name: role.name,
                roleId: role.id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.roleService.deleteRole(role.id);
                this.roles = this.roles.filter(r => r.id != role.id);
            }
        });
    }
}
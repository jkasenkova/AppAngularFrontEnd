import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit } from "@angular/core";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CreateLocationDialogComponent } from "./location-dialog/create-location/create-location.component";
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
import { Observable, of, pipe} from 'rxjs';
import { map, filter, tap } from 'rxjs/operators'
import { UpdateTemplateService } from "src/app/services/updateTemplateService";
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-user-orientation',
    standalone: true,
    imports: [NgbTooltipModule, MatButtonModule, AsyncPipe],
    templateUrl: './user-orientation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./user-orientation.component.less']
})
export class UserOrientationComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    locations$: Observable<LocationModel[]>;
    teams$: Observable<Team[]>;
    selectedLocation: LocationModel;
    selectedTeam: Team;
    roles: RoleModel[];

    constructor(
        private cdr: ChangeDetectorRef,
        private updateTemplateService: UpdateTemplateService,
        private locationService: LocationService,
        private teamService: TeamService,
        private templateService: TemplateService,
        private roleService: RoleService) {}

    ngOnInit(): void {
        this.locations$ = this.locationService.getLocations();
    }

    ngAfterViewChecked(){
        this.cdr.detectChanges();
     }

    selectLocation(location: LocationModel): void{
        this.selectedLocation = location;
        this.teams$ = this.locationService.getTeamsByLocationId(location.id);
        this.roles = [];
    }

    selectTeam(team: Team): void{
        this.selectedTeam = team;
        this.teamService.getRolesByTeamId(team.id).subscribe(roles => 
        {
            this.roles = roles.sort((a, b) => a.name.localeCompare(b.name));
        });
    }
    ///---------------Location------------------------------

    addLocation() {
        const dialogRef = this.dialog.open(CreateLocationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var location: Location = {
                    name: result.name,
                    timeZone: result.timeZone,
                    mapLink: result.mapLink,
                    address: result.address,
                    isAccountLocation: false
                };

                this.locationService.createLocation(location).subscribe(location =>{
                    this.locations$.pipe(map(x => {
                        x.push(location);
                        x.sort((a, b) => a.name.localeCompare(b.name));
                    }));
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
                this.locations$ = this.locations$.pipe(map(x => x.filter(l=>l.id != location.id)));
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
                timeZone: location.timeZone,
                isAccountLocation: location.isAccountLocation
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const updatedLocation: Location = {
                    id: result.id,
                    name: result.name,
                    timeZone: result.timeZoneId,
                    mapLink: result.result,
                    address: result.address,
                    isAccountLocation: result.isAccountLocation
                };

                this.locationService.updateLocation(updatedLocation);

                this.locations$.pipe(map(x => {
                    const existedLocation = x.find(l=> l.id == result.id);
                    const index = x.indexOf(existedLocation);
                    x.splice(index, 1, updatedLocation);
                    x.sort((a, b) => a.name.localeCompare(b.name));
                }));
            }
        });
    }

    //-----------------------Team----------------------------
    addTeam(locationId: string){
        const dialogRef = this.dialog.open(CreateTeamDialogComponent, { 
            data: { 
                locationId: locationId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                var team: Team = {
                    id: '',
                    name: result.teamName,
                    locationId: locationId
                };
                this.teamService.createTeam(team);
                this.teams$.pipe(map(x => x.push(team)));
                this.teams$ = this.teams$.pipe(map(x => x.sort((a, b) => a.name.localeCompare(b.name))));
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
                this.teams$ = this.teams$.pipe(map(x => x.filter(l=>l.id != team.id)));
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

        dialogRef.afterClosed().subscribe(updatedTeam => {
            if (updatedTeam) {
                this.teamService.updateTeam(updatedTeam);

                this.teams$.pipe(map(x => {
                    const existed = x.find(l => l.id == team.id);
                    const index = x.indexOf(existed);
                    x.splice(index, 1, updatedTeam);
                    x.sort((a, b) => a.name.localeCompare(b.name))
                }));
            }
        });
    }

    ///----------------Role---------------------------------------

    //add to template if create new (call ngChange() on template page)

    addRole(teamId: string){
        const dialogRef = this.dialog.open(CreateRoleDialogComponent, { 
            data: { 
                teamId: teamId,
                userType: UserType
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) 
            {
                if(result.template)
                {
                    if(result.template.id != null)
                    {
                        var role: RoleModel = {
                            name: result.name,
                            userType: result.userType,
                            teamId: result.teamId,
                            rotationType: result.rotationType,
                            shiftPatternType: result.shiftPatternType,
                            templateId: result.template.id
                        };

                        this.roles.push(role)
                        this.roleService.createRole(role).subscribe(newRole => role = newRole);
                        
                    }
                    else
                    {
                        var newTemplate: Template = {
                            name: result.template,
                            isHandover: false
                        };
                
                        this.templateService.addTemplate(newTemplate).subscribe(template =>
                        {
                            var role: RoleModel = {
                                name: result.name,
                                userType: result.userType,
                                teamId: result.teamId,
                                rotationType: result.rotationType,
                                shiftPatternType: result.shiftPatternType,
                                templateId: template.id
                            };

                            this.roles.push(role)
                            this.roleService.createRole(role).subscribe(newRole => role = newRole);
                            this.updateTemplateService.addItem(template);
                        });
                    }
                }
                this.roles = this.roles.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
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
            if (result) 
            {
                var role: RoleModel = {
                    id: result.id,
                    name: result.name,
                    userType: result.userType,
                    teamId: result.teamId,
                    rotationType: result.rotationType,
                    shiftPatternType: result.shiftPatternType
                };

                if(result.template)
                {
                    if(result.template.id != null)
                    {
                        role.templateId = result.template.id;
                        this.roleService.updateRole(role);
                    }
                    else
                    {
                        var newTemplate: Template = {
                            name: result.template,
                            isHandover: false
                        };
                    
                        this.templateService.addTemplate(newTemplate).subscribe(template => {
                            role.templateId = template.id;
                            this.roleService.updateRole(role);
                        });
                    }
                }

                
                let updateRole = this.roles.find(t=> t.id == role.id);
                let index = this.roles.indexOf(updateRole);
                this.roles[index] = role;

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
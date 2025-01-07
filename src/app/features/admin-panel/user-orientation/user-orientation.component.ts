import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnChanges, OnInit } from "@angular/core";
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
import { LocationService } from "src/app/services/locationService";
import { RoleService } from "src/app/services/roleService";
import { TeamService } from "src/app/services/teamServices";
import { Template } from "src/app/models/template";
import { TemplateService } from "src/app/services/templateService";
import { TemplateManagementService } from "src/app/features/admin-panel/handover-templates/template/services/templateManagementService";
import { map, of, Observable } from "rxjs";
import { Location } from "@models/location";
import {CommonModule} from '@angular/common';
import { LocationManagementService } from "./services/locationManagementServices";
import { TeamManagementService } from "./services/teamManagementService";
import { RoleManagementService } from "./services/roleManagementService";
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-user-orientation',
    standalone: true,
    imports: [
        NgbTooltipModule, 
        MatButtonModule,
        CommonModule
    , AsyncPipe],
    templateUrl: './user-orientation.component.html',
    changeDetection: ChangeDetectionStrategy.Default,
    styleUrls: ['./user-orientation.component.less']
})

export class UserOrientationComponent implements OnInit, OnChanges {
    readonly dialog = inject(MatDialog);
    locations$: Observable<Location[]>;
    teams$: Observable<Team[]>;
    selectedLocation: Location;
    selectedTeam: Team;
    
    //locations$ = this.locationManagementService.locations$;
    roles$ = this.roleManagementService.roles$; 
    //teams$ = this.teamManagementService.teams$; 

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private templateManagementService: TemplateManagementService,
        private locationService: LocationService,
        private locationManagementService: LocationManagementService,
        private teamManagementService: TeamManagementService,
        private roleManagementService: RoleManagementService,
        private teamService: TeamService,
        private templateService: TemplateService,
        private roleService: RoleService) {}

    ngOnInit(): void {
        this.locations$ = this.locationService.getLocations();
    }

    ngOnChanges(): void {
        this.changeDetectorRef.detectChanges();
    }

    selectLocation(location: Location): void {
        this.selectedLocation = location;
        this.teams$ = this.locationService.getTeamsByLocationId(location.id);
        this.roles$ = of([]);
        this.teams$ = this.locationService.getTeamsByLocationId(location.id).pipe(
            map((teams: Team[]) =>
                this.teamManagementService.setData(teams.sort((a, b) => a.name.localeCompare(b.name))))
        );
    }

    selectTeam(team: Team): void {
        this.selectedTeam = team;
        this.roles$ = this.teamService.getRolesByTeamId(team.id).pipe(
            map((roles: RoleModel[]) =>
                this.roleManagementService.setData(roles.sort((a, b) => a.name.localeCompare(b.name))))
        );
    }

    //---------------------Location------------------------------

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

    removeLocation(location: Location){
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

    editLocation(location: Location){
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
                    timeZone: result.timeZone,
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

    //-----------------------Team---------------------------------

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
                this.teamService.createTeam(team).subscribe(team => {
                    this.teamManagementService.addTeam(team);
                });
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

    //------------------------Role--------------------------------

    addRole(teamId: string){
        const dialogRef = this.dialog.open(CreateRoleDialogComponent, { 
            data: { 
                teamId: teamId,
                userType: UserType,
                roles: this.roleManagementService.roles$
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

                        this.roleService.createRole(role).subscribe(newRole => {
                            this.roleManagementService.addRole(newRole);
                        });
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

                            this.roleService.createRole(role).subscribe(newRole => {
                                this.roleManagementService.addRole(newRole);
                            });

                            this.templateManagementService.addItem(template);
                        });
                    }
                }
                else{
                    var role: RoleModel = {
                        name: result.name,
                        userType: result.userType,
                        teamId: result.teamId,
                        rotationType: result.rotationType
                    };

                    this.roleService.createRole(role).subscribe(newRole => {
                        this.roleManagementService.addRole(newRole);
                    });
                }
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
                shiftPatternType: role.shiftPatternType,
                roles: this.roleManagementService.roles$
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
                    if(result.template.id !== null && role.templateId !== result.template.id)
                    {
                        role.templateId = result.template.id;
                        this.roleService.updateRole(role);
                        this.roleManagementService.updateRole(role);
                    }
                    else
                    {
                        var newTemplate: Template = {
                            name: result.template,
                            isHandover: false
                        };
                    
                       /*  this.templateService.addTemplate(newTemplate).subscribe(template => {
                            role.templateId = template.id;

                            this.roleService.updateRole(role);
                            this.roleManagementService.updateRole(role);
                        }); */

                        this.templateService.addTemplate(newTemplate).pipe(
                            map((createdTemplate) => role.templateId = createdTemplate.id) 
                        );

                        this.roleService.updateRole(role);
                        this.roleManagementService.updateRole(role);
                    }
                }

                else{
                    this.roleService.updateRole(role);
                    this.roleManagementService.updateRole(role);
                }
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
                this.roleManagementService.deleteRole(result.teamId);
            }
        });
    }
}
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

    locationListTemp: LocationModel[] = [
        {
            id: Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4"),
            name: "Ukraine",
            timeZoneId: Guid.parse("0aaceca4-4036-4e08-a30d-72a36da93db0")
        },
        {
            id: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            name: "London",
            timeZoneId: Guid.parse("e27aa77e-09ab-48e1-a3fa-59dbe94f5d7c")
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

    ngOnInit(): void {
        this.locations = this.locationListTemp;
    }

    selectLocation(location:LocationModel){
        this.selectedLocation = location;

        this.teams = this.teamsListTemp.filter(t => t.locationId.toString() == location.id.toString());
    }

    selectTeam(team: Team){
        this.selectedTeam = team;
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

    addRole(teamId: Guid){

    }
}
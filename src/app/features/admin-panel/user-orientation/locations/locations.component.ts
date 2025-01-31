import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit } from "@angular/core";
import { CreateLocationDialogComponent } from "../location-dialog/create-location/create-location.component";
import { EditLocationDialogComponent } from "../location-dialog/edit-location/edit-location.component";
import { DeleteLocationDialogComponent } from "../location-dialog/delete-location/delete-location.component";
import { LocationModel } from "@models/locationModel";
import { LocationService } from "@services/locationService";
import { Location } from "@models/location";
import { Observable, of, pipe} from 'rxjs';
import { map, filter, tap } from 'rxjs/operators'
import { UpdateTemplateService } from "@services/updateTemplateService";
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-locations',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './locations.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./locations.component.less']
})
export class LocationsComponent implements OnInit {
    readonly dialog = inject(MatDialog);
    locations$: Observable<LocationModel[]>;
    teams: Team[] = [];
    selectedLocation: LocationModel;
    selectedTeam: Team;
    roles: RoleModel[];

    constructor(
        private cdr: ChangeDetectorRef,
        private locationService: LocationService) {}

    ngOnInit(): void {
        this.locations$ = this.locationService.getLocations();
        //this.locationService.getLocations().pipe(map((x: LocationModel[]) => x)).subscribe(x => this.locations$ = x);
    }

    selectLocation(location: LocationModel): void{
        this.selectedLocation = location;
        this.locationService.getTeamsByLocationId(location.id).subscribe(teams => 
        {
            this.teams = teams.filter(t => t.locationId == location.id).sort((a, b) => a.name.localeCompare(b.name));
        });
        this.roles = [];
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
                    //this.locations$.push(location);
                    //this.locations$ = this.locations$.sort((a, b) => a.name.localeCompare(b.name));
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
                //this.locationService.deleteLocation(location.id);
                //this.locations$ = this.locations$.filter(l=>l.id != location.id);
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
                var locationUpdate: Location = {
                    id: result.id,
                    name: result.name,
                    timeZone: result.timeZoneId,
                    mapLink: result.result,
                    address: result.address,
                    isAccountLocation: result.isAccountLocation
                };

                this.locationService.updateLocation(locationUpdate);

                //let updateLocation = this.locations$.find(l=> l.id == result.id);
                //let index = this.locations$.indexOf(updateLocation);
                //this.locations$[index] = locationUpdate;

                //this.locations$ = this.locations$.sort((a, b) => a.name.localeCompare(b.name));
            }
        });
    }
}
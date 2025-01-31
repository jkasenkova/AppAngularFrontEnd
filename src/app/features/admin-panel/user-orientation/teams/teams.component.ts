import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit } from "@angular/core";
import { CreateLocationDialogComponent } from "../location-dialog/create-location/create-location.component";
import { EditLocationDialogComponent } from "../location-dialog/edit-location/edit-location.component";
import { DeleteLocationDialogComponent } from "../location-dialog/delete-location/delete-location.component";
import { LocationModel } from "@models/locationModel";
import { LocationService } from "@services/locationService";
import { Team } from "@models/team";
import { Observable, of, pipe} from 'rxjs';
import { map, filter, tap } from 'rxjs/operators'
import { UpdateTemplateService } from "@services/updateTemplateService";
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-teams',
    standalone: true,
    imports: [AsyncPipe],
    templateUrl: './teams.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./teams.component.less']
})
export class TeamsComponent implements OnInit {
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
}
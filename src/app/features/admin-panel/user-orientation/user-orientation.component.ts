import { Component, inject, OnInit } from "@angular/core";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CreateLocationDialogComponent } from "./location-dialog/create-location/create-location.component";
import { LocationModel} from "./model/locationModel";
import { Guid } from "guid-typescript";
import { EditLocationDialogComponent } from "./location-dialog/edit-location/edit-location.component";
import { DeleteLocationDialogComponent } from "./location-dialog/delete-location/delete-location.component";

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

    ngOnInit(): void {
        this.locations = this.locationListTemp;
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
}
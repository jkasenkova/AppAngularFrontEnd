import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment-timezone';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { Timezone } from "../../../../../models/timezoneModel";
import { LocationModel } from "../../../../../models/locationModel";
import { TimezoneProvider } from '../../../../../shared/timezone.provider';
import { LocationService } from "src/app/services/locationService";
import { CommonModule } from "@angular/common";
import { Location } from "../../../../../models/location";

@Component({
    selector: 'location-dialog',
    templateUrl: './edit-location.component.html',
    styleUrl: '../../../../../styles/pop-up.less',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
        MatIconModule,
        MatSelectModule,
        MatDialogModule,
        NgbDatepickerModule,
        MatAutocompleteModule,
        CommonModule
    ],
})
export class EditLocationDialogComponent implements OnInit{
    locationForm: FormGroup;
    filteredTimeZone: string[];
    timeZones: Timezone[] = [];
    locations: Location[];

    constructor(
        private timezoneProvider: TimezoneProvider,
        private fb: FormBuilder,
        private locationService: LocationService,
        public dialogRef: MatDialogRef<EditLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Location
    ) {
        this.locationForm = this.fb.group({
            name: [data.name, Validators.required],
            address: [data.address],
            mapLink: [data.mapLink],
            id: [data.id],
            timeZone: [data.timeZone, Validators.required],
            isAccountLocation: data.isAccountLocation
        });
    }


    ngOnInit(){

        this.locationService.getLocations().subscribe(locations =>{
            this.locations = locations;
        });

        this.timeZones = this.timezoneProvider.getTimezones();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        var locationName = this.locationForm.get('name').value;

        if(this.locations.find(l=>l.name == locationName) != null){
            this.locationForm.get('name').setErrors({'existLocationName': true})
        }

        if (this.locationForm.valid) {
            this.dialogRef.close(this.locationForm.value);
        }
    }
}
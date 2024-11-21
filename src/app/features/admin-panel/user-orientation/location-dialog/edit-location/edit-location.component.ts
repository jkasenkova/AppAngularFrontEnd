import { Component, Inject, ViewEncapsulation } from "@angular/core";
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

@Component({
    selector: 'location-dialog',
    templateUrl: './edit-location.component.html',
    styleUrl: '/../../../../../styles/pop-up.less',
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
        MatAutocompleteModule
    ],
})
export class EditLocationDialogComponent {
    locationForm: FormGroup;
    filteredTimeZone: string[];
    timeZones: Timezone[] = [];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LocationModel
    ) {
        this.locationForm = this.fb.group({
            name: [data.name, Validators.required],
            address: [data.address],
            mapLink: [data.mapLink],
            id: [data.id],
            timeZoneControl: new FormControl(''),
            timeZoneId: [data.timeZoneId, Validators.required],
            isAccountLocation: data.isAccountLocation
        });
    }


    ngOnInit(){
        this.timeZones = moment.tz.names().map((zoneName) => {
            return {
                zoneName: zoneName,
                utc: moment.tz(zoneName).format('Z'),
                zoneAbbr: moment.tz(zoneName).zoneAbbr()
            }
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.locationForm.valid) {
            this.dialogRef.close(this.locationForm.value);
        }
    }
}
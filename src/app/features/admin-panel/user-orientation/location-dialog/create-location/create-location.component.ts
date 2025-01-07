import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CommonModule } from '@angular/common';
import { Timezone } from "../../../../../models/timezoneModel";
import { TimezoneProvider } from '../../../../../shared/timezone.provider';
import { LocationManagementService } from "../../services/locationManagementServices";
import { Location } from "src/app/models/location";

@Component({
    selector: 'location-dialog',
    templateUrl: './create-location.component.html',
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
export class CreateLocationDialogComponent implements OnInit {
    locationForm: FormGroup;
    filteredTimeZone: string[];
    timeZones: Timezone[] = [];
    locations: Location[];

    locations$ = this.locationManagementService.locations$;

    constructor(
        private timezoneProvider: TimezoneProvider,
        private fb: FormBuilder,
        private locationManagementService: LocationManagementService,
        public dialogRef: MatDialogRef<CreateLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Location
    ) {

        this.locationForm = this.fb.group({
            name: [null, Validators.required],
            address: null,
            mapLink: null,
            timeZone: [null, Validators.required],
            isAccountLocation: false
        });

        this.locations$.subscribe(locations => this.locations = locations);
    }

    ngOnInit(): void {
        this.timeZones = this.timezoneProvider.getTimezones();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        var locationName = this.locationForm.get('name').value;

        if (this.doesRoleNameExist(locationName)) {
            this.locationForm.get('name').setErrors({'existRoleName': true})
        } 

        if (this.locationForm.valid) {
            this.dialogRef.close(this.locationForm.value);
        }
    }

    doesRoleNameExist(nameToCheck: string): boolean {
        return this.locations.some((location) => location.name === nameToCheck);
    }
}
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
import { LocationModel } from "../../model/locationModel";
import moment from 'moment-timezone';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import {AsyncPipe} from '@angular/common';

@Component({
    selector: 'location-dialog',
    templateUrl: './create-location.component.html',
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
        MatAutocompleteModule,
        AsyncPipe
    ],
})
export class CreateLocationDialogComponent implements OnInit {
    locationForm: FormGroup;
    timeZones: string[];
    filteredTimeZone: Observable<string[]>;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LocationModel
    ) {
        this.locationForm = this.fb.group({
            name: ['', Validators.required],
            address: [''],
            mapLink: [''],
            timeZoneControl: new FormControl(''),
            timeZoneId: ['', Validators.required]
        });
    }

    ngOnInit(){
        this.timeZones =  moment.tz.names();

        this.filteredTimeZone = this.locationForm.get('timeZoneControl').valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
    
        return this.timeZones.filter(option => option.toLowerCase().includes(filterValue));
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
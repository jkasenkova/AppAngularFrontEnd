import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from "@angular/common";
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { DatesModel } from "../../models/datesModel";
import {formatDate} from '@angular/common';


@Component({
    selector: 'dates-shift',
    templateUrl: './dates-shift.component.html',
    styleUrl: './dates-shift.component.less',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        MatDialogModule,
        CommonModule,
        NgxMatTimepickerModule
    ]
})
export class DatesShiftDialogComponent {
    datestForm: FormGroup;
    today: boolean = true; 

    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DatesShiftDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DatesModel
    ) { 
        this.datestForm = this.fb.group({
            handoverOwnerId: data.ownerId,
            handover: data.handover,
            endDate: [new Date().toDateString(), Validators.required],
            time: [null, Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.datestForm.valid) {
            this.dialogRef.close(this.datestForm.value);
        }
    }
    

    setDate(day:string){
        var endDate = '';
        if(day == 'Today'){
            this.today = true;
            endDate = new Date().toLocaleDateString(undefined, this.options);
        }
        else{
            this.today = false;
            const newDate = new Date();
            endDate = new Date(newDate.setDate(newDate.getDate() + 1)).toLocaleDateString(undefined, this.options);
           
        }
        this.datestForm.get('endDate').setValue(endDate);
    }
}
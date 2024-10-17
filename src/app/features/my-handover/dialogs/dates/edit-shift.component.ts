import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Handover } from "src/app/models/handover";
import { CommonModule } from "@angular/common";
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';

@Component({
    selector: 'edit-shift',
    templateUrl: './edit-shift.component.html',
    styleUrl: './edit-shift.component.less',
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
export class EditShiftDialogComponent {
    datestForm: FormGroup;
    today: boolean = true; 

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditShiftDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover
    ) { 

        this.data.endDate = new Date().toDateString();

        this.datestForm = this.fb.group({
            handover: data,
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

    setDate(date:string){
        if(date == 'Today'){
            this.today = true;
            this.data.endDate = new Date().toDateString();
        }
        else{
            this.today = false;
            this.data.endDate = new Date(+1).toDateString();
        }
    }
}
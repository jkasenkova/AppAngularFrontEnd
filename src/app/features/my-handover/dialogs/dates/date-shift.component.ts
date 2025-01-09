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


@Component({
    selector: 'date-shift',
    templateUrl: './date-shift.component.html',
    styleUrl: './date-shift.component.less',
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
export class DateShiftDialogComponent {
    datesForm: FormGroup;
    today: boolean = true; 


    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DateShiftDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DatesModel
    ) { 
        const initialTime = (data && data.endTime) ? this.formatDateToTimeString(this.setTime(data.endTime)): null;
        this.datesForm = this.fb.group({
            endDate: [(data && data.endDate) ? data.endDate : new Date().toLocaleDateString(), Validators.required],
            endTime: [initialTime, Validators.required]
        });
    }

    setTime(timeStr: string): Date {
        const date = new Date();
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        
        if (modifier === "PM" && hours !== 12) {
          hours += 12;
        } else if (modifier === "AM" && hours === 12) {
          hours = 0; 
        }
        date.setHours(hours, minutes, 0, 0);

        return date;
    }

    formatDateToTimeString(date: Date): string {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.datesForm.valid) {
            this.dialogRef.close(this.datesForm.value);
        }
    }
    
    setDate(day: string): void {
        if(day == 'Today'){
            this.today = true;
            var endDate = new Date().toLocaleDateString();
            this.datesForm.get('endDate').setValue(endDate);
        }
        else{
            this.today = false;
            const newDate = new Date();
            var endDate = new Date(newDate.setDate(newDate.getDate() + 1)).toLocaleDateString();
            this.datesForm.get('endDate').setValue(endDate);
        }
        
    }
}
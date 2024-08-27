import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { LocationModel } from "../../model/locationModel";

@Component({
    selector: 'location-dialog',
    templateUrl: './delete-location.component.html',
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
        NgbDatepickerModule
    ],
})
export class DeleteLocationDialogComponent {
    locationForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DeleteLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LocationModel
    ) {
        this.locationForm = this.fb.group({
            name: [data.name, Validators.required],
            locationId: [data.id, Validators.required]
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
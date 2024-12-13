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
import { LocationModel } from "src/app/models/locationModel";
import { LocationService } from "src/app/services/locationService";

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
export class DeleteLocationDialogComponent implements OnInit{
    locationForm: FormGroup;
    isCanDelete: boolean = false;

    constructor(
        private fb: FormBuilder,
        private locationService: LocationService,
        public dialogRef: MatDialogRef<DeleteLocationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LocationModel
    ) {
        this.locationForm = this.fb.group({
            name: [data.name, Validators.required],
            locationId: [data.id, Validators.required]
        });
    }
    ngOnInit(): void {
        this.locationService.getTeamsByLocationId(this.data.id)
        .subscribe(teams =>
        {
           this.isCanDelete = teams.length > 0;
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
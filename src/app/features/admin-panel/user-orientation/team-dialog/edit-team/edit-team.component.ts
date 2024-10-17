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
import { Team } from "src/app/models/team";

@Component({
    selector: 'team-dialog',
    templateUrl: './edit-team.component.html',
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
export class EditTeamDialogComponent {
    teamForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditTeamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Team
    ) {
        debugger;
        this.teamForm = this.fb.group({
            name: [data.name, Validators.required],
            id:[data.id],
            locationId:[data.locationId]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.teamForm.valid) {
            this.dialogRef.close(this.teamForm.value);
        }
    }
}
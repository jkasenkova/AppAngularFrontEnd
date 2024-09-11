import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from "../../model/userModel";
import { RotationType } from "../../../user-orientation/model/rotationType";

@Component({
    selector: 'edit-user-dialog',
    templateUrl: './edit-user-dialog.component.html',
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
        MatGridListModule,
        NgbDatepickerModule
    ],
})
export class EditUserDialogComponent {
    userForm: FormGroup;
    public showPassword: boolean;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel
    ) {

        this.userForm = this.fb.group({
            userName: [data.userName, Validators.required],
            userSurname: [data.userSurname, Validators.required],
            email: [data.email, [Validators.required, Validators.email]],
            lineManagers: [data.lineManagers, Validators.required],
            roles: [data.roles, Validators.required],
            role: "Team Lead",
            teams: [data.teams, Validators.required],
            team: "Team 1",
            rotation: [RotationType.NoRotation],
            template: "Template 1",
            companyId: ['', Validators.required],
            contributors: [data.contributors],
            password: [data.password, Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(10)
            ])],
            confirmPassword: [data.password, Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(10)
            ])]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.userForm.valid) {
            this.dialogRef.close(this.userForm.value);
        }
    }
}
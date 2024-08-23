import { Component, inject, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from "../../model/userModel";

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

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel
    ) {

        this.userForm = this.fb.group({
            userName: [data.userName, Validators.required],
            userSurname: [data.userSurname, Validators.required],
            email: [data.email, Validators.required, Validators.email],
            lineManagers: [data.lineManagers, Validators.required],
            roles: [data.roles, Validators.required],
            teams: [data.teams, Validators.required],
            rotation: [''],
            template: [''],
            companyId: ['', Validators.required],
            contributors: [''],
            password: [data.password, Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100)
            ])],
            confirmPassword: [data.password, Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100)
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
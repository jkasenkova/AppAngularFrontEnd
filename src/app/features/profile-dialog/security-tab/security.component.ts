import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { UserModel } from "src/app/models/user";
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from "src/app/services/userService";

@Component({
    selector: 'security-tab',
    templateUrl: './security.component.html',
    styleUrl: './security.component.less',
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
        MatAutocompleteModule,
        MatTabsModule
    ],
})
export class SecurityTabComponent implements OnInit {
    securityForm: FormGroup;
    visible: boolean = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<SecurityTabComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel,
        private userService: UserService 
    ) {
        this.securityForm = this.fb.group({
            email: [data.email, [Validators.required, Validators.email]],
            secondaryEmail: ['', Validators.email],
            curentPassword: [data.password],
            newPassword: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(16)
            ])],
            confirmNewPassword: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(16)
            ])]
        });
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.securityForm.valid) {
            this.dialogRef.close(this.securityForm.value);
        }
    }

    onChangePassword(){
        this.data.password = this.securityForm.get('newPassword').value;
        this.userService.updateUser(this.data);
    }
}
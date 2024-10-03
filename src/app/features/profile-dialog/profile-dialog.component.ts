import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserModel } from "src/app/models/user";
import { MatTabsModule } from '@angular/material/tabs';
import { AccountTabComponent } from "./account-tab/account.component";
import { ProfileTabComponent } from "./profile-tab/profile.component";
import { RoleService } from "src/app/services/roleService";

@Component({
    selector: 'profile-dialog',
    templateUrl: './profile-dialog.component.html',
    styleUrl: '../../styles/pop-up.less',
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
        MatDialogModule,
        MatTabsModule,
        AccountTabComponent,
        ProfileTabComponent
    ],
})
export class ProfileDialogComponent implements OnInit {
    profileForm: FormGroup;
    admin: boolean = true;
    
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProfileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel, 
        private roleService: RoleService
    ) {

        this.profileForm = this.fb.group({
            userName: [data.userName, Validators.required],
            surName:  [data.userSurname, Validators.required],
            title: data.title,
            roleName: ''
        });

        this.roleService.getRoleById(data.roleId).subscribe(role =>  
            this.profileForm.get('roleName').setValue(role.roleName));

    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        this.dialogRef.close(this.profileForm.value);
    }
}
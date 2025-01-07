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
import { PersonalTabComponent } from "../personal-tab/personal.component";
import { SecurityTabComponent } from "../security-tab/security.component";

@Component({
    selector: 'profile-tab',
    templateUrl: './profile.component.html',
    styleUrl: '../../../styles/pop-up.less',
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
        MatTabsModule,
        PersonalTabComponent,
        SecurityTabComponent
    ],
})
export class ProfileTabComponent implements OnInit {
    profileForm: FormGroup;
    admin: boolean = true;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ProfileTabComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel
    ) {
        this.profileForm = this.fb.group({
            firstName: [data.name, Validators.required],
            lastName: [data.surname, Validators.required],
            title: data.title
        });
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.profileForm.valid) {
            this.dialogRef.close(this.profileForm.value);
        }
    }
}
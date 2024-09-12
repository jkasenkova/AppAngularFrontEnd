import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { UserModel } from "src/app/models/user";
import { SecurityTabComponent } from "../security-tab/security.component";

@Component({
    selector: 'personal-tab',
    templateUrl: './personal.component.html',
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
        SecurityTabComponent
    ],
})
export class PersonalTabComponent implements OnInit {
    personalForm: FormGroup;
    admin: boolean = true;
    titles: string[];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<PersonalTabComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel
    ) {
        this.personalForm = this.fb.group({
            name: [data.userName, Validators.required],
            userSurname: [data.userSurname, Validators.required],
            title: data.title,
            roleName: "Developer"
        });

       this.titles = ["Mr", "Mrs", "Ms", "Miss", "Dr"];
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.personalForm.valid) {
            this.dialogRef.close(this.personalForm.value);
        }
    }

    onSelectTitle(event: any){
        this.data.title = event.value;
    }
}
import { Component, Inject, ViewEncapsulation } from "@angular/core";
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
import { RoleService } from "src/app/services/roleService";

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
export class PersonalTabComponent {
    personalForm: FormGroup;
    admin: boolean = true;
    titles: string[];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<PersonalTabComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel,
        private roleService: RoleService
    ) {
        this.personalForm = this.fb.group({
            firstName: [data.firstName, Validators.required],
            lastName: [data.lastName, Validators.required],
            title: data.title,
            roleName: ''
        });


        this.roleService.getRoleById(this.data.roleId).subscribe(role =>  
            this.personalForm.get('roleName').setValue(role.name));

        this.titles = ["Mr", "Mrs", "Ms", "Miss", "Dr"];
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
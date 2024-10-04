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
import { RoleModel } from "src/app/models/role";
import { RoleService } from "src/app/services/roleService";
import { RotationType } from "../../../../../models/rotationType";

@Component({
    selector: 'create-user-dialog',
    templateUrl: './create-user-dialog.component.html',
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
export class CreateUserDialogComponent {
    userForm: FormGroup;
    rolesOfTeam: RoleModel[];
    showPassword: boolean;
    showRecipient: boolean = false;
    
    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel, private roleService: RoleService
    ) {

        this.userForm = this.fb.group({
            userName: ['', Validators.required],
            userSurname: ['', Validators.required],
            email: ['', Validators.required, Validators.email],
            lineManagers: [data.lineManagers, Validators.required],
            roles: [data.roles, Validators.required],
            teams: [data.teams, Validators.required],
            rotation: [''],
            template: [''],
            companyId: ['', Validators.required],
            contributors: [data.contributors],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100)
            ])],
            confirmPassword: ['', Validators.compose([
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(100)
            ])],
            recipients:[]
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

    onSelectTeam(event: any){
        this.rolesOfTeam = this.data.roles.filter(r => r.teamId.toString() == event.value.teamId.toString());
    }

    onSelectRole(event: any){
       var roleId = event.value.roleId;

       var role = this.data.roles.find(r => r.roleId == roleId);

        if(role){
            this.userForm.get('rotation').setValue(role.rotationType);
            this.userForm.get('template').setValue("Template 1");// role.templateId get name from service

            if(role.rotationType == RotationType.Shift){
                this.showRecipient = true;
            }
        }
    }
}
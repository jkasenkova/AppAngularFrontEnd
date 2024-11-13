import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
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
import { Team } from "src/app/models/team";
import { RoleModel } from "src/app/models/role";
import { Guid } from "guid-typescript";
import { UserType } from "src/app/models/userType";
import { RotationType } from "../../../../../models/rotationType";

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
export class EditUserDialogComponent implements OnInit {
    userForm: FormGroup;
    public showPassword: boolean;
    showRecipient: boolean = true;

    team :  Team =
    {
        id: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862"),
        name: "Team 1",
        locationId: Guid.parse("d0b2ca1a-d8b9-4a61-bf61-a17e100fbe74")
    };

    role: RoleModel = 
        {
            roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
            roleName: "Team Lead",
            locationId: Guid.parse("d0b2ca1a-d8b9-4a61-bf61-a17e100fbe74"),
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            userType: UserType.Administrator,
            rotationType: RotationType.NoRotation,
            teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862")
        };

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserModel
    ) {

        this.userForm = this.fb.group({
            firstName: [data.firstName, Validators.required],
            lastName: [data.lastName, Validators.required],
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
            ])],
            recipients:[]
        });
/* 
        this.userForm.get('team').setValue(this.team);
        this.userForm.get('role').setValue(this.role); */
    }

    ngOnInit(): void {
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
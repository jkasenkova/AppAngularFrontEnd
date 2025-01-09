import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UserModel } from '../../model/userModel';
import { RoleModel } from '@models/role';
import { RoleService } from '@services/roleService';
import { RotationType } from '@models/rotationType';
import { AuthService } from '@services/auth/auth.service';
import { AuthFacade } from '@services/auth/store/auth.facade';
import { AddUserRequest } from '@models/addUserRequest';
import { AddUserResponse } from '@models/addUserResponse';
import { UserService } from '@services/userService';
import { TeamService } from '@services/teamServices';
import { LocationService } from '@services/locationService';
import { UserModel as AddUserModel } from '@models/user';
import { Team } from '@models/team';
import { LocationModel } from '@models/locationModel';
import { TemplateService } from "@services/templateService";
import { Observable } from "rxjs";

@Component({
    selector: 'create-user-dialog',
    templateUrl: './create-user-dialog.component.html',
    styleUrl: '../../../../../styles/pop-up.less',
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
export class CreateUserDialogComponent implements OnInit {
    userForm: FormGroup;
    roles: RoleModel[];
    showPassword: boolean;
    showRecipient: boolean = false;
    accountId: string;
    teamList: Team[] = [];
    roleList: RoleModel[] = [];
    locations: LocationModel[] = [];
    users$: Observable<UserModel[]>;

    constructor(
        private fb: FormBuilder,
        private templateService: TemplateService,
        private userService: UserService,
        public dialogRef: MatDialogRef<CreateUserDialogComponent>,
        private authService: AuthService,
        private authFacade: AuthFacade,
        private teamService: TeamService,
        private roleService: RoleService,
        private locationService: LocationService,
        @Inject(MAT_DIALOG_DATA) public data: UserModel
    ) {
    }

    ngOnInit(): void {
        this.teamService.getTeams().subscribe(teams => {
            this.teamList = teams
        });

        this.roleService.getRoles().subscribe(roles => {
            this.roleList = roles
        });

        this.locationService.getLocations().subscribe(locations => {
            this.locations = locations
        });

        this.authFacade.accountId$.subscribe(result => {
            this.accountId = result;   
        });

        this.roles = this.data.roles;
        this.userForm = this.fb.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required, Validators.email],
            lineManagers: [],
            roles: [this.roles],
            teams: [this.teamList],
            rotation: [''],
            template: [''],
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
            const addUserRequest: AddUserRequest = {
                email: this.userForm.value.email,
                firstName: this.userForm.value.firstName,
                lastName: this.userForm.value.lastName,
                accountId: this.accountId,
                password: this.userForm.value.password,
                roleId: this.userForm.value.roleId
            };

            this.authService.addUser(addUserRequest).subscribe((response: AddUserResponse) => {
                if (response.succeeded) {
                    const user : AddUserModel = {
                        id: response.userId,
                        firstName: this.userForm.value.firstName,
                        lastName: this.userForm.value.lastName,
                        email: this.userForm.value.email,
                        roleId: this.userForm.value.roleId,
                        companyId: this.accountId
                    };
    
                    this.userService.createUser(user).subscribe();
                }
            });

            this.dialogRef.close(this.userForm.value);
        }
    }

    onSelectTeam(event: any){
        this.roles = this.data.roles.filter(r => r.teamId == event.value.id);
    }

    onSelectRole(event: any){
       var roleId = event.value.id;

       var role = this.data.roles.find(r => r.id == roleId);

        if(role){
            this.userForm.get('rotation').setValue(role.rotationType);

            this.templateService.getTemplateById(role.templateId).subscribe(template =>{
                this.userForm.get('template').setValue(template.name);

                if(role.rotationType == RotationType.Shift){
                    this.showRecipient = true;
                }
            })
        }
    }
}
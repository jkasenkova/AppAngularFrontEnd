import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { RoleModel } from "src/app/models/role";
import { Template } from "src/app/models/template";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { RotationType } from "../../../../../models/rotationType";
import { UserType } from "src/app/models/userType";
import { ShiftPatternType } from "src/app/models/shiftPatternType";
import { CommonModule } from "@angular/common";
import { TemplateManagementService } from "src/app/features/admin-panel/handover-templates/template/services/templateManagementService";

@Component({
    selector: 'role-dialog',
    templateUrl: './create-role.component.html',
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
        NgbDatepickerModule,
        MatAutocompleteModule,
        CommonModule
    ],
})
export class CreateRoleDialogComponent {
    roleForm: FormGroup;
    selectedRotation: boolean = false;
    templates: Template[];
    isRotationDisabled: boolean = false;
    roles: RoleModel[];

    rotationOptions = RotationType.getAll();
    userTypeOptions = UserType.getAll();
    shiftPatternsOptions = ShiftPatternType.getAll();

    constructor(
        private fb: FormBuilder,
        private templateManagementService: TemplateManagementService,
        public dialogRef: MatDialogRef<CreateRoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.roleForm = this.fb.group({
            name: [null, Validators.required],
            teamId: data.teamId,
            template: null,
            userType: [null, Validators.required],
            rotationType: [null, Validators.required],
            shiftPatternType: null,
            roles: data.roles.subscribe((response: RoleModel[]) => this.roles = response)
        });
    }

    ngOnInit() {
        this.templates = this.templateManagementService.getData();

        this.roleForm.get('userType')?.valueChanges.subscribe((value) => {
            if (value === 2) {
                this.roleForm.get('rotationType')?.setValue(1);
                this.selectedRotation = true;
            } else {
                this.roleForm.get('rotationType').reset();
                this.selectedRotation = false;
            }
        });
    }

    displayFn(template?: Template): string | undefined {
        return template ? template.name : undefined;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        var roleName = this.roleForm.get('name').value;

        if (this.doesRoleNameExist(roleName)) {
            this.roleForm.get('name').setErrors({'existRoleName': true})
        } 

        if (this.roleForm.valid) {
            this.dialogRef.close(this.roleForm.value);
        }
    }

    selectRotation(event: any){
        if(event.value == 1){
            this.selectedRotation = true;
        }else{
            this.selectedRotation = false;
            this.isRotationDisabled = false;
        }
    }

    doesRoleNameExist(nameToCheck: string): boolean {
        return this.roles.some((role) => role.name === nameToCheck);
    }
}
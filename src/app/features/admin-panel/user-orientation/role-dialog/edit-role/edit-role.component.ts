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
import { UserType } from "src/app/models/userType";
import { ShiftPatternType } from "src/app/models/shiftPatternType";
import { Template } from "src/app/models/template";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { RotationType } from "src/app/models/rotationType";
import { CommonModule } from "@angular/common";
import { TemplateManagementService } from "src/app/features/admin-panel/handover-templates/template/services/templateManagementService";
import { map, Observable, startWith } from "rxjs";

@Component({
    selector: 'role-dialog',
    templateUrl: './edit-role.component.html',
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
        NgbDatepickerModule,
        MatAutocompleteModule,
        CommonModule
    ],
})
export class EditRoleDialogComponent {
    roleForm: FormGroup;
    selectedRotation: boolean = false;
    templates: Template[];
    isRotationDisabled: boolean = false;
    roles: RoleModel[];
    filteredOptions!: Observable<Template[]>;

    rotationOptions = RotationType.getAll();
    userTypeOptions = UserType.getAll();
    shiftPatternsOptions = ShiftPatternType.getAll();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditRoleDialogComponent>,
        private templateManagementService: TemplateManagementService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        if(data.rotationType == 1){
            this.selectedRotation = true;
        }
        
        this.roleForm = this.fb.group({
            name: [data.name, Validators.required],
            teamId: data.teamId,
            template: data.templateId,
            selectedOption: data.templateId,
            userType: [data.userType, Validators.required],
            id: data.id,
            rotationType: [data.rotationType, Validators.required],
            shiftPatternType: data.shiftPatternType,
            roles: data.roles.subscribe((response: RoleModel[]) => this.roles = response)
        });

        if(data.shiftPatternType){
            this.selectedRotation = true;
        }
    }

    ngOnInit() {
        this.templates = this.templateManagementService.getData();

        if(this.data.templateId){
            var template = this.templates.find(t => t.id === this.data.templateId);
            this.roleForm.get('template')?.setValue(template);
        }

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
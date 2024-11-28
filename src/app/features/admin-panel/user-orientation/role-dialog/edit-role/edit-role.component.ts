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
import { map, Observable, startWith } from "rxjs";
import { RotationType } from "src/app/models/rotationType";
import { TemplateService } from "src/app/services/templateService";
import { RoleService } from "src/app/services/roleService";

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
        MatAutocompleteModule
    ],
})
export class EditRoleDialogComponent {
    roleForm: FormGroup;
    userTypes: string[];
    rotationTypes: string[];
    shiftPatternTypes: string[];
    selectedRotation: boolean = false;
    templates: Template[];
    isRotationDisabled: boolean = false;
    filteredOptions: Observable<Template[]>;
    template: Template;
    role: RoleModel;

    rotationOptions = RotationType.getAll();
    userTypeOptions = UserType.getAll();
    shiftPatternsOptions = ShiftPatternType.getAll();

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditRoleDialogComponent>,
        private templateService: TemplateService,
        private roleService: RoleService,
        @Inject(MAT_DIALOG_DATA) public data: RoleModel
    ) {
        if(data.rotationType == 1){
            this.selectedRotation = true;
        }

        this.roleForm = this.fb.group({
            name: [data.name, Validators.required],
            teamId: data.teamId,
            template: [''],
            userType: [data.userType, Validators.required],
            id: data.id,
            rotationType: [data.rotationType, Validators.required],
            shiftPatternType: data.shiftPatternType
        });

        if(data.shiftPatternType){
            this.selectedRotation = true;
        }
    }

    ngOnInit() {
        this.templateService.getTemplates().subscribe(templates =>{
            this.templates = templates;
        });
        this.templateService.getTemplateById(this.data.templateId)
        .subscribe({
            next: (response) => {
                this.roleForm.get('template').setValue(response);
            },
            error: (err) => {
              console.error('Error Get template By Id', err);
            },
        });
    }

    displayFn(template?: Template): string | undefined {
        return template ? template.name : undefined;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.roleForm.valid) {
            this.dialogRef.close(this.roleForm.value);
        }
    }

    changeRotationType(event:any){
        var rotationType = this.roleForm.get('rotationType').value;

        if(rotationType == 0){
            this.selectedRotation = false;
            this.roleForm.get('shiftPatternType').reset();
        }else{
            this.selectedRotation = true;
        }
    }

    onSelectUserType(event: any){
        if(event.value == 2){
            this.roleForm.get('rotationType')?.setValue(RotationType.Shift);
            this.isRotationDisabled = true;
            this.selectedRotation = true;
        }
        else{
            this.roleForm.get('rotationType').reset();
            this.selectedRotation = false;
            this.isRotationDisabled = false;
        }
    }

    selectTemplate(option: any){
        this.roleForm.get('template').setValue(option);
    }
}
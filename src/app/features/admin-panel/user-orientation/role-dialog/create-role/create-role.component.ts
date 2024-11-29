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
import { Guid } from "guid-typescript";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { RotationType } from "../../../../../models/rotationType";
import { UserType } from "src/app/models/userType";
import { ShiftPatternType } from "src/app/models/shiftPatternType";
import { TemplateService } from "src/app/services/templateService";
import { TeamService } from "src/app/services/teamServices";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'role-dialog',
    templateUrl: './create-role.component.html',
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
export class CreateRoleDialogComponent {
    roleForm: FormGroup;
    userTypes: string[];
    rotationTypes: string[];
    shiftPatternTypes: string[];
    selectedRotation: boolean = false;
    templates: Template[];
    isRotationDisabled: boolean = false;
    filteredOptions: Observable<Template[]>;
    roles: RoleModel[];

    rotationOptions = RotationType.getAll();
    userTypeOptions = UserType.getAll();
    shiftPatternsOptions = ShiftPatternType.getAll();

    constructor(
        private fb: FormBuilder,
        private templateService: TemplateService,
        private teamService: TeamService,
        public dialogRef: MatDialogRef<CreateRoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RoleModel
    ) {
        this.roleForm = this.fb.group({
            name: [null, Validators.required],
            teamId: data.teamId,
            template: null,
            userType: [null, Validators.required],
            rotationType: [null, Validators.required],
            shiftPatternType: null
        });
    }

    ngOnInit() {
        this.teamService.getRolesByTeamId(this.data.teamId).subscribe(roles =>{
            this.roles = roles;
        });

        this.templateService.getTemplates().subscribe(templates =>{
            this.templates = templates;

            this.filteredOptions = this.roleForm.get('template').valueChanges.pipe(
                startWith(''),
                map(value => this.filterOptions(value || '')),
            );
        });
   /*  
        if(this.templates){
            this.filteredOptions = this.roleForm.get('template').valueChanges.pipe(
                startWith(''),
                map(value => this.filterOptions(value || '')),
            );
        }  */
    }

    
  private filterOptions(value: string): Template[] {
    if(value != ''){
        const filterValue = value.toLowerCase();
        return this.templates.filter(template =>
            template.name.toLowerCase().includes(filterValue)
        );
    }
    return [];
  }


    displayFn(template?: Template): string | undefined {
        return template ? template.name : undefined;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        var roleName = this.roleForm.get('name').value;

        if(this.roles.find(l=>l.name == roleName) != null){
            this.roleForm.get('name').setErrors({'existRoleName': true})
        }

        if (this.roleForm.valid) {
            this.dialogRef.close(this.roleForm.value);
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

    selectRotation(event: any){
        if(event.value == 1){
            this.selectedRotation = true;
        }else{
            this.selectedRotation = false;
        }
    }
}
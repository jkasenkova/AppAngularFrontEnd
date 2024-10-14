import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
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
import { Guid } from "guid-typescript";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { map, Observable, startWith } from "rxjs";
import { RotationType } from "../../../../../models/rotationType";

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
        MatAutocompleteModule
    ],
})
export class CreateRoleDialogComponent {
    roleForm: FormGroup;
    userTypes: string[];
    rotationTypes: string[];
    shiftPatternTypes: string[];
    selectedRotation: boolean = false;
    templates: Template[];
    filteredOptions: Observable<Template[]>;

    templateListTemp: Template[] = [
        {
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            templateName: "Template 1",
            isHandoverTemplate: false,
            sections: []
        },
        {
            templateId: Guid.parse("92e15cb3-e13d-4c02-8622-483ac0bf89c2"),
            templateName: "Template 2",
            isHandoverTemplate: false,
            sections: []
        },
    ];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateRoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RoleModel
    ) {
        this.roleForm = this.fb.group({
            roleName: [data.roleName, Validators.required],
            teamId: [data.teamId],
            locationId: [data.locationId],
            template: [''],
            userType: [data.userType, Validators.required],
            rotationType: [data.rotationType, Validators.required]
        });

        this.userTypes = Object.values(UserType);
        this.rotationTypes = Object.values(RotationType);
        this.shiftPatternTypes = Object.values(ShiftPatternType);
        this.templates = this.templateListTemp;
    }

    ngOnInit() {
        this.filteredOptions = this.roleForm.valueChanges.pipe(
          startWith(""),
          map(value => (typeof value === "string" ? value : value.name)),
          map(name => (name ? this._filter(name) : this.templates.slice()))
        );
        
      }

      private _filter(name: string): Template[] {
        const filterValue = name.toLowerCase();
    
        return this.templates.filter(
          option => option.templateName.toLowerCase().indexOf(filterValue) === 0
        );
      }

      displayFn(template?: Template): string | undefined {
        console.log(template ? template.templateId : "");
        return template ? template.templateName : undefined;
      }
      returnFn(template?: Template): string | undefined {
        return template ? template.templateId.toString() : undefined;
      }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        debugger;
        if (this.roleForm.valid) {
            this.dialogRef.close(this.roleForm.value);
        }
    }

    onSelectRotationType(event: any){
        if(event.value == "No Rotation"){
            this.selectedRotation = false;
        }else{
            this.selectedRotation = true;
        }
    }

    onSelectUserType(event: any){
        if(event.value == "User"){
            this.roleForm.get('rotationType').setValue(RotationType.Shift);
            this.roleForm.get('rotationType').disable();
            this.selectedRotation = true;
        }
        else{
            this.roleForm.get('rotationType').reset();
            this.roleForm.get('rotationType').enable();
            this.selectedRotation = false;
        }
    }
}
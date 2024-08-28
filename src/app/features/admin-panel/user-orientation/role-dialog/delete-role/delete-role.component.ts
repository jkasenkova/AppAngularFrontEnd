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
import { MatAutocompleteModule } from "@angular/material/autocomplete";

@Component({
    selector: 'role-dialog',
    templateUrl: './delete-role.component.html',
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
export class DeleteRoleDialogComponent {
    roleForm: FormGroup;


    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DeleteRoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: RoleModel
    ) {
        this.roleForm = this.fb.group({
            roleName: [data.roleName, Validators.required],
            roleId: [data.roleId]
        });

    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.roleForm.valid) {
            this.dialogRef.close(this.roleForm.value);
        }
    }

}
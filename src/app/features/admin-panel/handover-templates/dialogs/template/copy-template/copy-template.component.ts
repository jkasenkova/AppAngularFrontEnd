import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { TemplateDialogModel } from "../../../models/templateDialogModel";
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'create-template-dialog',
    templateUrl: './copy-template.component.html',
    styleUrl: '../../../../../../styles/pop-up.less',
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
        MatDialogModule,
        MatGridListModule,
        MatSelectModule
    ],
})
export class CopyTemplateDialogComponent {
    templateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CopyTemplateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TemplateDialogModel
    ) {
        this.templateForm = this.fb.group({
            templateName:[data.templateName, Validators.required],
            templateId: [data.templateId],
            copyToTemplate: ['', Validators.required],
            templates: [data.templates]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.templateForm.valid) {
            this.dialogRef.close(this.templateForm.value);
        }
    }
}
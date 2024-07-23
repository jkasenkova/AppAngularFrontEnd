import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { TemplateDialogModel } from "./templateDialogModel";

@Component({
    selector: 'template-dialog',
    templateUrl: './template-dialog.component.html',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule
    ],
})
export class TemplateDialogComponent {
    templateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<TemplateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TemplateDialogModel
    ) {
        this.templateForm = this.fb.group({
            templateId: [data.templateId],
            templateName: [data.templateName, Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        debugger;
        if (this.templateForm.valid) {
            this.dialogRef.close(this.templateForm.value);
        }
    }
}
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { TemplateDialogModel } from "../../models/templateDialogModel";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'edit-template-dialog',
    templateUrl: './edit-template-dialog.component.html',
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
        MatIconModule
    ],
})
export class EditTemplateDialogComponent {
    templateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditTemplateDialogComponent>,
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
        if (this.templateForm.valid) {
            this.dialogRef.close(this.templateForm.value);
        }
    }
}
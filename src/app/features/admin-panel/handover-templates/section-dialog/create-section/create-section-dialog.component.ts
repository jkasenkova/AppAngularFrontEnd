import { Component, Inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { SectionDialogModel } from "../../models/sectionDialogModel";

@Component({
    selector: 'template-dialog',
    templateUrl: './create-section-dialog.component.html',
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
export class CreateSectionDialogComponent {
    sectionForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SectionDialogModel
    ) {
        this.sectionForm = this.fb.group({
            sectionName: [data.sectionName, Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.sectionForm.valid) {
            this.dialogRef.close(this.sectionForm.value);
        }
    }
}
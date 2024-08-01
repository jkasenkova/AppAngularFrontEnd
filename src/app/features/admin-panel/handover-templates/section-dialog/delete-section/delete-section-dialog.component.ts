import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { SectionDialogModel } from "../../models/sectionDialogModel";
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'template-dialog',
    templateUrl: './delete-section-dialog.component.html',
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
export class DeleteSectionDialogComponent {
    sectionForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DeleteSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SectionDialogModel
    ) {
        this.sectionForm = this.fb.group({
            sectionId: [data.sectionId],
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
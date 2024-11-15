import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { SectionDialogModel } from "../../../models/sectionDialogModel";

@Component({
    selector: 'crete-section',
    templateUrl: './create-section.component.html',
    styleUrl: './create-section.component.less',
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
        MatGridListModule
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
            sectionName: ['', Validators.required]
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
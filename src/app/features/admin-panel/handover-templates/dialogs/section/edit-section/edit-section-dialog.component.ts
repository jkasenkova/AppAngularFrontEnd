import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { Section } from "src/app/models/section";
import { SectionService } from "src/app/services/sectionService";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'edit-section-dialog',
    templateUrl: './edit-section-dialog.component.html',
    styleUrl: './edit-section-dialog.component.less',
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
        CommonModule
    ],
})
export class EditSectionDialogComponent {
    sectionForm: FormGroup;
    sections?: Section[];

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.sectionForm = this.fb.group({
            id: data.id,
            name: [data.sectionName, Validators.required]
        });

        this.sections = data.sections as Section[];
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        var sectionName = this.sectionForm.get('name').value;

        if(this.sections.find(l => l.name.toLocaleLowerCase() == sectionName.toLocaleLowerCase()) != null){
            this.sectionForm.get('name').setErrors({'existSectionName': true})
        }
        if (this.sectionForm.valid) {
            this.dialogRef.close(this.sectionForm.value);
        }
    }
}
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { SectionService } from "src/app/services/sectionService";
import { Section } from "src/app/models/section";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'create-section-dialog',
    templateUrl: './create-section-dialog.component.html',
    styleUrl: './create-section-dialog.component.less',
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
export class CreateSectionDialogComponent {
    sectionForm: FormGroup;
    sections?: Section[];

    constructor(
        private fb: FormBuilder,
        private sectionService: SectionService,
        public dialogRef: MatDialogRef<CreateSectionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.sectionForm = this.fb.group({
            name: ['', Validators.required],
            templateId: data.templateId
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
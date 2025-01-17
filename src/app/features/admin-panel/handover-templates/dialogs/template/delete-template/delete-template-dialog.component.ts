import { Component, EventEmitter, Inject, Input, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { Template } from "src/app/models/template";

@Component({
    selector: 'delete-template-dialog',
    templateUrl: './delete-template-dialog.component.html',
    styleUrl: './delete-template-dialog.component.less',
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
export class DeleteTemplateDialogComponent {
    templateForm: FormGroup;
    @Input() selectedTemplate: EventEmitter<boolean> = new EventEmitter<boolean>();;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DeleteTemplateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Template
    ) {
        this.templateForm = this.fb.group({
            templateId: data.id,
            name: [data.name, Validators.required]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        debugger;
        if (this.templateForm.valid) {
            this.selectedTemplate.emit(false);
            this.dialogRef.close(this.templateForm.value);
        }
    }
}
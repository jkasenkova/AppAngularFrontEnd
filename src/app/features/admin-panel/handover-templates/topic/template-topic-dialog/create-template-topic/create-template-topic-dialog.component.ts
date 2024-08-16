import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TemplateTopicDialogModel } from "../../model/templateTopicDialogModel";
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 

@Component({
    selector: 'create-template-topic-dialog',
    templateUrl: './create-template-topic-dialog.component.html',
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
        MatSelectModule,
        MatDialogModule,
        MatGridListModule
    ],
})
export class CreateTemplateTopicDialogComponent {
    templateTopicForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateTemplateTopicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TemplateTopicDialogModel
    ) {
        this.templateTopicForm = this.fb.group({
            templateTopicName: ['', Validators.required],
            templateReferenceName: ['', Validators.required],
            templateDescription: [''],
            templates: [data.templates]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.templateTopicForm.valid) {
            this.dialogRef.close(this.templateTopicForm.value);
        }
    }
}
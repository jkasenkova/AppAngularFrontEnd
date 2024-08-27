import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TemplateTopicDialogModel } from "../../model/templateTopicDialogModel";
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'edit-template-topic-dialog',
    templateUrl: './edit-template-topic-dialog.component.html',
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
        MatSelectModule
    ],
})
export class EditTemplateTopicDialogComponent {
    templateTopicForm: FormGroup;
    selectTemplate: boolean = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditTemplateTopicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TemplateTopicDialogModel
    ) {
        this.templateTopicForm = this.fb.group({
            templateTopicName: [data.templateTopicName, Validators.required],
            templateReferenceName: [data.templateReferenceName, Validators.required],
            templateDescription: [data.templateDescription],
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

    onSelectTemplate(selectTemplate:any){
        if(selectTemplate){
            this.selectTemplate = true;
        }
    }
}
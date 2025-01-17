import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, ViewEncapsulation } from "@angular/core";
import { EditTopicDataModel } from "../../models/editTopicData";

@Component({
    selector: 'edit-topic',
    templateUrl: './edit-topic.component.html',
    styleUrl: './edit-topic.component.less',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
        CommonModule      
    ],
})

export class EditTopicDialogComponent {
    editTopicForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditTopicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EditTopicDataModel
    ) 
    {
        this.editTopicForm = this.fb.group({
            topicId: data.topicId,
            topicName: data.topicName,
            referenceId: data.referenceId,
            referenceName: data.referenceName,
            referenceNotes: data.referenceNotes
        });
    }

    onSave(): void {
        if (this.editTopicForm.valid) {
            this.dialogRef.close(this.editTopicForm.value);
        }
    }
}
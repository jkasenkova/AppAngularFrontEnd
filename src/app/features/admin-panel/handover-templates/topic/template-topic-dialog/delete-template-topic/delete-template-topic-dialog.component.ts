import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { TopicDataModel } from "../../model/topicDataModel";

@Component({
    selector: 'delete-template-topic-dialog',
    templateUrl: './delete-template-topic-dialog.component.html',
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
export class DeleteTemplateTopicDialogComponent {
    templateTopicForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<DeleteTemplateTopicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TopicDataModel
    ) {
        this.templateTopicForm = this.fb.group({
            templateTopicName: data.templateTopic.name,
            templateTopicId: data.templateTopic.id
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
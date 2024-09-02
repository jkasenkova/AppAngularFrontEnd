import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TemplateTopicDialogModel } from "../../model/templateTopicDialogModel";
import { MatSelectModule } from '@angular/material/select';
import { Template } from "src/app/models/template";

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

        data.templates = data.associatedTemplates ? this.getSelectTemplates(data.templates, data.associatedTemplates) : data.templates;

        this.templateTopicForm = this.fb.group({
            templateTopicName: [data.templateTopicName, Validators.required],
            templateReferenceName: [data.templateReferenceName, Validators.required],
            templateDescription: data.templateDescription,
            templates: data.templates,
            associatedTemplates: [data.associatedTemplates]
        });
    }

    getSelectTemplates(sourceArr: Template[], targetArr: Template[]): Template[]
    {
        return  sourceArr.filter( ( el ) => !targetArr.includes( el ));
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
        if(selectTemplate.value != undefined){
            this.selectTemplate = true;

            this.data.sections = selectTemplate.value.sections;
        
        }else{
            this.selectTemplate = false;
        }
    }
}
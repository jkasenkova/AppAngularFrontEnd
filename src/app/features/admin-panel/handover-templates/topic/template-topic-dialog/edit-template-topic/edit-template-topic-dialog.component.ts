import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Template } from "src/app/models/template";
import { TopicDataModel } from "../../model/topicDataModel";
import { SectionService } from "src/app/services/sectionService";
import { Section } from "src/app/models/section";

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
    sections: Section[];
    
    constructor(
        private fb: FormBuilder,
        private sectionService: SectionService,
        public dialogRef: MatDialogRef<EditTemplateTopicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TopicDataModel
    ) {
        debugger;
        if(data.sectionId){
           /*  this.sectionService.getSectionById(data.sectionId).subscribe(section =>{
                var templates = data.templates.find(t => t.id == section.templateId);
            }) */
        }
       

        this.templateTopicForm = this.fb.group({
            templateTopicName: [data.templateTopicName, Validators.required],
            templateReferenceName: [data.templateReferenceName, Validators.required],
            templateDescription: data.templateDescription,
            templates: data.templates,
            associatedTemplates: null,
            sectionName: null
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
        if(selectTemplate.value != undefined){
            this.selectTemplate = true;

            this.sectionService.getSections(selectTemplate.value.id).subscribe(sections => 
            {
                this.sections = sections;
            });
        
        }else{
            this.selectTemplate = false;
        }
    }
}
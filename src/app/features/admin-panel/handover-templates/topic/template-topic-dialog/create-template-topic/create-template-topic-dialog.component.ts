import { Component, inject, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { ModalDismissReasons, NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TopicDataModel } from "../../model/topicDataModel";
import { SectionService } from "src/app/services/sectionService";
import { Section } from "src/app/models/section";
import { TemplateTopic } from "src/app/models/templateTopic";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

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
        MatGridListModule,
        NgbDatepickerModule,
        MatAutocompleteModule
    ],
})
export class CreateTemplateTopicDialogComponent {
    templateTopicForm: FormGroup;
    selectTemplate: boolean = false;
    sections: Section[];
    
    constructor(
        private fb: FormBuilder,
        private sectionService: SectionService, 
        public dialogRef: MatDialogRef<CreateTemplateTopicDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.templateTopicForm = this.fb.group({
            templateTopicName: ['', Validators.required],
            templateReferenceName: ['', Validators.required],
            templateDescription: null,
            sectionId: null,
            templates: data.templates,
            topics: data.topics,
            templateTopicId: null
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
            this.sections = selectTemplate.value.sections;
        
        }else{
            this.selectTemplate = false;
        }
    }

    onSelectSection(selectSection:any){
        if(selectSection.value != undefined){
            this.templateTopicForm.get('sectionId').setValue(selectSection.value.id);
        }
    }

    onSelectAddTopic(event: any): void {
        var topic = event.option.value as TemplateTopic;

        this.templateTopicForm.patchValue({
            templateTopicId: topic.id,
            templateTopicName: topic.name
        });
    }
}
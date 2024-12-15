import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Guid } from "guid-typescript";
import { Reference } from "src/app/models/reference";
import { Section } from "src/app/models/section";
import { TemplateTopic } from "src/app/models/templateTopic";
import { TemplateReferenceService } from "src/app/services/templateReferenceService";
import { TemplateTopicService } from "src/app/services/templateTopicService";
import { ClickOutsideDirective } from "src/app/shared/clickoutside.directive";

@Component({
    selector: 'add-topic',
    standalone: true,
    imports: [
        FormsModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        CommonModule,
        MatIconModule,
        ClickOutsideDirective,
        MatSelectModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './add-topic.component.html',
    styleUrls: ['./add-topic.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class AddTopicComponent {
    addTopicForm: FormGroup;
    references: Reference[];
    @Input() sectionOut: Section;
    @Output() dataEmitter = new EventEmitter<boolean>();

    constructor( 
        private templateTopicService: TemplateTopicService,
        private templateReferenceService: TemplateReferenceService,
        private fb: FormBuilder) 
    {
            this.addTopicForm = this.fb.group({
                topic: new FormControl(),
                reference: new FormControl(),
                topicName: new FormControl(),
                referenceName: new FormControl(),
                description: new FormControl()
            });
    }

    closeNewLine(): void {
        this.dataEmitter.emit(false); 
      }

    onSelectAddTopic(event: any): void {
        var topic = event.option.value as TemplateTopic;

        this.addTopicForm.patchValue({
            topic: topic
        });
        this.references = topic.templateReferences.filter(r => !r.enabled);
    }

    onSelectAddReference(event: any): void {
        var reference = event.option.value;

        this.addTopicForm.patchValue({
            reference: reference
        });
    }

    displayRefFn(reference?: Reference): string | undefined {
        return reference ? reference.name : undefined;
    }
    
    addTopic(): void 
    {
        if(this.addTopicForm.valid)
        {
            if(this.addTopicForm.value.topic)
            {
                var topic = this.addTopicForm.value.topic as TemplateTopic;
              
                if(!topic.enabled && topic.sectionId != this.sectionOut.id)
                {
                    topic.enabled = true;
                    topic.sectionId = this.sectionOut.id;
                    topic.index = this.sectionOut.sectionTopics.length ?? 0;

                    this.templateTopicService.updateTopic(topic);
                }
                if(this.addTopicForm.value.reference)
                {
                    var reference = this.addTopicForm.value.reference as Reference;
                    reference.enabled = true;
            
                    let updateReference = topic.templateReferences.find(t => t.id == reference.id);
                    let index = topic.templateReferences.indexOf(updateReference);
                    topic.templateReferences[index] = reference;
            
                    this.templateReferenceService.updateTemplateReference(reference);
                }
                else
                {
                    var reference = this.addReference(
                        topic.id, 
                        this.addTopicForm.value.referenceName, 
                        this.addTopicForm.value.description);
    
                    topic.templateReferences.push(reference);
                    topic.templateReferences = topic.templateReferences.sort((a, b) => a.name.localeCompare(b.name));
                }
            }
            else
            {
                var topic: TemplateTopic = {
                    name: this.addTopicForm.value.topicName,
                    enabled: true,
                    index: this.sectionOut.sectionTopics ? this.sectionOut.sectionTopics.length : 0,
                    editing: false,
                    isExpand: false,
                    sectionId: this.sectionOut.id,
                    templateReferences: []
                }

                var newReference: Reference = {
                    name: this.addTopicForm.value.referenceName,
                    enabled: true,
                    index: 0,
                    description: this.addTopicForm.value.description,
                    editing: false,
                    templateTopicId: topic.id,
                    expand: false
                };

                this.templateTopicService.addTemplateTopic(topic).subscribe(newTopic =>
                {
                    newReference.templateTopicId = newTopic.id;
                    newReference.enabled = true;
                    this.templateReferenceService.addTemplateReference(newReference);
        
                    newTopic.templateReferences = [];
                    newTopic.templateReferences.push(newReference);
                    newTopic.templateReferences = newTopic.templateReferences.sort((a, b) => a.name.localeCompare(b.name));

                    if(this.sectionOut.sectionTopics == null){
                        this.sectionOut.sectionTopics = [];
                    }
                    this.sectionOut.sectionTopics.push(newTopic);
                });
            }
        }

        this.addTopicForm.reset();
        this.dataEmitter.emit(false); 
    }

    addReference(topicId: any, referenceName: string, description: string): Reference{
        var newReference: Reference = {
            name: referenceName,
            enabled: true,
            index: 0,
            description: description,
            editing: false,
            templateTopicId: topicId,
            expand: false
        };

        this.templateReferenceService.addTemplateReference(newReference);

        return newReference;
    }
}
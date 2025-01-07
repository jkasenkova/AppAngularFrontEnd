import { CommonModule } from "@angular/common";
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { HandoverSection } from "src/app/models/handoverSection";
import { RotationReference } from "src/app/models/rotationReference";
import { RotationTopic } from "src/app/models/rotationTopic";
import { RotationReferenceService } from "src/app/services/rotationReferenceService";
import { RotationTopicService } from "src/app/services/rotationTopicService";
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
    references: RotationReference[];
    @Input() sectionOut: HandoverSection;
    @Output() dataEmitter = new EventEmitter<boolean>();

    constructor( 
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
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
        var topic = event.value as RotationTopic;

        this.addTopicForm.patchValue({
            topicName: topic.name,
            topic: topic
        });

        this.references = topic.references.filter(r => !r.enabled);
    }

    onSelectAddReference(event: any): void {
        var reference = event.option.value;

        this.addTopicForm.patchValue({
            reference: reference,
            referenceName: reference.name,
            description: reference.description
        });
    }

    displayRefFn(reference?: RotationReference): string | undefined {
        return reference ? reference.name : undefined;
    }
    
    addTopic(): void{
        if(this.addTopicForm.value.topic){
            var topic = this.addTopicForm.value.topic as RotationTopic;
            topic.enabled = true;
            topic.sectionId = this.sectionOut.sectionId;
            topic.index = this.sectionOut.sectionTopics.length ?? 0;

            if(this.addTopicForm.value.reference){

                var reference = this.addTopicForm.value.reference as RotationReference;
                reference.enabled = true;

                let updateReference = topic.references.find(t=> t.id == reference.id);
                let index = topic.references.indexOf(updateReference);
                topic.references[index] = reference;
        
                this.rotationReferenceService.updateRotationReference(reference);
            }

            else{

                var newReference: RotationReference = {
                    id: this.addTopicForm.value.referenceId ?? '',//Guid.create(),
                    name: this.addTopicForm.value.referenceName,
                    enabled: true,
                    rotationTopicId: topic.id,
                    index: 0,
                    templateReference: false,
                    description: this.addTopicForm.value.description,
                    isPinned: false,
                    checked: false,
                    editing: false,
                    expand: false
                };

                topic.references.push(newReference);
            }

            topic.references = topic.references.sort((a, b) => a.name.localeCompare(b.name));

            this.rotationTopicService.addRotationTopic(topic);
            this.rotationReferenceService.addRotationReference(newReference);
        }

        this.addTopicForm.reset();
        this.dataEmitter.emit(false); 
    }
    
}
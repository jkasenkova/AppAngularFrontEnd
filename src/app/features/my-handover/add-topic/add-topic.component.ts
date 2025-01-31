import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, Output, ViewEncapsulation } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RotationSection } from "src/app/models/handoverSection";
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
    @Input() section: RotationSection;
    @Output() dataEmitter = new EventEmitter<boolean>();
    @Output() sectionUpdated  = new EventEmitter<RotationSection>(); 

    constructor( 
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
        private cdr: ChangeDetectorRef,
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

        this.references = topic.rotationReferences.filter(r => !r.enabled);
    }

    onSelectAddReference(event: any): void {
        var reference = event.option.value;

        this.addTopicForm.get('referenceName').setValue(reference);
    }

    displayRefFn(reference: any): string {
      return reference ? reference.name : '';
    }
    
    addTopic(): void {
        this.updateOrCreateTopicAndReference(this.addTopicForm, this.section.id);
        this.addTopicForm.reset();
        this.sectionUpdated.emit(this.section);
        this.dataEmitter.emit(false); 
    }

    updateOrCreateTopicAndReference(formGroup: FormGroup, sectionId: string): void {
      const topicControl = formGroup.get('topic'); 
      const referenceControl = formGroup.get('referenceName'); 
      const descriptionControl = formGroup.get('description');
      if (topicControl && topicControl.value) {
        const topic: RotationTopic = topicControl.value;
    
        if (topic.enabled !== true || topic.sectionId !== sectionId) {
          topic.enabled = true;
          topic.sectionId = sectionId;
          this.cdr.detectChanges();
          this.rotationTopicService.updateTopic(topic).subscribe();
        } 
        this.handleReferenceLogic(referenceControl, descriptionControl, topic);
      }
    }
    
    private handleReferenceLogic(referenceControl: AbstractControl<any,any> | null, descriptionControl: AbstractControl<any,any> | null, topic: RotationTopic): void {
      const reference: RotationReference = referenceControl.value;
      if (referenceControl.value && reference.id != null) {
        if (reference.enabled !== true) {
          reference.enabled = true; 
          this.cdr.detectChanges();
          this.rotationReferenceService.updateRotationReference(reference).subscribe();
        }
      } 
      else {
        var newReference: RotationReference = {
          name: referenceControl.value,
          enabled: true,
          rotationTopicId: topic.id,
          index: 0,
          templateReference: false,
          description: descriptionControl.value,
          isPinned: false,
          checked: false,
          editing: false,
          expand: false,
          whitePin: false
      };
    
        this.rotationReferenceService.addRotationReference(newReference).subscribe({
          next: (createdReference) => {
            const topicFind = this.section.topics.find(t => t.id === topic.id);
            topicFind.rotationReferences.push(createdReference);
            this.section.topics = [...this.section.topics];
            this.sectionUpdated.emit(this.section);
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error creating reference:', err),
        });
      }
    }
}
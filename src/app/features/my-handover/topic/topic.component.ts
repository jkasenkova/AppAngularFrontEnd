import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Guid } from "guid-typescript";
import { HandoverSection } from "src/app/models/handoverSection";
import { RotationReferenceService } from "src/app/services/rotationReferenceService";
import { RotationTopicService } from "src/app/services/rotationTopicService";
import { CreateSectionDialogComponent } from "../dialogs/sections/create-section/create-section.component";
import { MatDialog } from "@angular/material/dialog";
import { HandoverSectionService } from "src/app/services/handoverSectionService";
import { EditSectionDialogComponent } from "../dialogs/sections/edit-section/edit-section.component";
import { DeleteSectionDialogComponent } from "../dialogs/sections/delete-section/delete-section.component";
import { RotationTopic } from "src/app/models/rotationTopic";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { SortType } from "src/app/models/sortType";
import { RotationReference } from "src/app/models/rotationReference";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { Handover } from "src/app/models/handover";
import { ClickOutsideDirective } from './clickoutside.directive';

@Component({
    selector: 'topic',
    standalone: true,
    imports: [
        FormsModule,
        MatAutocompleteModule,
        FormsModule,
        MatInputModule,
        DragDropModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatTooltipModule,
        CommonModule,
        MatIconModule,
        ClickOutsideDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './topic.component.html',
    styleUrls: ['./topic.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class TopicComponent implements OnInit {
    @Input() handoverOut: Handover; 
    topicForm: FormGroup;
    addTopicForm: FormGroup;
    readonly dialog = inject(MatDialog);
    @ViewChildren("addRowElement") addRowElement: QueryList<ElementRef>;
    enableAddTopicBtn: boolean = true;
    references: RotationReference[];

    constructor(
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
        private handoverSectionService: HandoverSectionService, 
        private fb: FormBuilder) 
        {
            this.topicForm = this.fb.group({
                topicName: new FormControl(),
                referenceName: new FormControl(),
                description: new FormControl()
            });

            this.addTopicForm = this.fb.group({
                topic: new FormControl(),
                referenceId: new FormControl(),
                topicName: new FormControl(),
                referenceName: new FormControl(),
                description: new FormControl()
            });
        }

    ngOnInit(): void {
    }
    //----------------------Section Dialogs--------------------------

    createSectionDialog(handoverId: Guid): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
             data: { 
                handoverId: handoverId 
            },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.handoverSectionService.createSection(result);
            }
        });
    }

    editSectionDialog(section: HandoverSection): void {

        const dialogRef = this.dialog.open(EditSectionDialogComponent, {
            data: { 
                sectionId: section.sectionId, 
                sectionName: section.sectionName 
            },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let updateSection = this.handoverOut.sections.find(t => t.sectionId == result.sectionId);
                let index = this.handoverOut.sections.indexOf(updateSection);
                this.handoverOut.sections[index].sectionName = result.sectionName;
                this.handoverSectionService.updateSection(result);
            }
        });
    }

    deleteSectionDialog(section: HandoverSection): void {
        const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
            data: { sectionId: section.sectionId, sectionName: section.sectionName },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handoverSectionService.deleteSection(result.sectionId)
            }
        });
    }


    //-----------------------------Topics--------------------------------

    addTopic(section: HandoverSection, index: number){
        var newTopic: RotationTopic;

        if(this.addTopicForm.value.topic){
            newTopic = this.addTopicForm.value.topic as RotationTopic;
            newTopic.enabled = true;
            newTopic.sectionId = section.sectionId;
            newTopic.index = section.sectionTopics.length ?? 0;
        }
        else{
            newTopic = {
                id: Guid.create(),
                isPinned: false,
                name: this.addTopicForm.value.topicName,
                enabled: true,
                index: section.sectionTopics.length ?? 0,
                editing: false,
                isExpand: false,
                templateTopic: false,
                checked: false,
                sectionId: section.sectionId,
                references: []
            };
        }

        var newReference: RotationReference = {
            id: this.addTopicForm.value.referenceId ?? Guid.create(),
            name: this.addTopicForm.value.referenceName,
            enabled: true,
            rotationTopicId: newTopic.id,
            index: 0,
            templateReference: false,
            description: this.addTopicForm.value.description,
            isPinned: false,
            checked: false,
            editing: false,
            expand: false
        };

        newTopic.references.push(newReference);
       
        newTopic.references = newTopic.references.sort((a, b) => a.name.localeCompare(b.name))

        var otherTopic = section.sectionTopics.find(t => t.id == newTopic.id);

        if(otherTopic){
            let index = section.sectionTopics.indexOf(otherTopic);
            section.sectionTopics[index] = newTopic;
            otherTopic = newTopic;
        }else{
            section.sectionTopics.push(newTopic);
        }
        
       
        this.rotationTopicService.addRotationTopic(newTopic);
        this.rotationReferenceService.addRotationReference(newReference);

        this.addHideRowTopicForm(section, index);

        this.addTopicForm.reset();
    }

    editTopic(topic: RotationTopic): void{
        topic.editing = !topic.editing;

        this.topicForm.get('topicName').setValue(topic.name);
    }

     addHideRowTopicForm(section: HandoverSection, index: number): void{
        let nativeElement = this.addRowElement.toArray()[index].nativeElement;
        
        nativeElement.style.display =
          nativeElement.style.display === "none" || !nativeElement.style.display
          ? "inline-block"
            : "none";

             if(nativeElement.style.display !== "none"){
                this.enableAddTopicBtn = false;
                section.addBtnShow = false;
            }else{
                this.enableAddTopicBtn = true;
                section.addBtnShow = true;
            }
    }

    getCountReferences(topic: RotationTopic): number {
        return topic.references != null ? topic.references.filter(t => t.enabled).length : 0;
    }
    
    expanded(topic: RotationTopic): boolean {
        return topic.references != null ? topic.references.filter(t => t.enabled).length > 0 : false;
    }

    dropTopic(event: CdkDragDrop<RotationTopic[]>, topics: RotationTopic[], section: HandoverSection): void {
   
        moveItemInArray(topics, event.previousIndex, event.currentIndex);
    
        topics.forEach((x, index) => {
          x.index = index
        });
    
        if(section.sortType == SortType.alphabetically){
            section.sortType = SortType.index;
            this.handoverSectionService.updateSection(section);
        }

        //update index for topics
    }
    
    onSelectAddTopic(event: any): void {
        var topic = event.option.value;
        this.addTopicForm.get('topicName').setValue(topic.name);
        this.addTopicForm.get('topic').setValue(topic);
    }


    updateTopic(topic: RotationTopic){
        topic.editing = !topic.editing;
        this.rotationTopicService.updateTopic(topic);
    }

    checkedTopic(topic: RotationTopic, section: HandoverSection){
        topic.checked = !topic.checked;

        this.updateTopicInArray(topic, section);
    }

    updateTopicInArray(topic: RotationTopic, section: HandoverSection){
        let updateTopic = section.sectionTopics.find(t=> t.id == topic.id);
        let index = section.sectionTopics.indexOf(updateTopic);
        section.sectionTopics[index] = topic;

        this.rotationTopicService.updateTopic(topic);
    }

    topicPinned(topic: RotationTopic, section: HandoverSection): void{
        topic.isPinned = !topic.isPinned;

       this.updateTopicInArray(topic, section);
    }

    removeTopic(topic: RotationTopic,  section: HandoverSection){
        topic.enabled = false;

        this.updateTopicInArray(topic, section);
    }

    //----------------References--------------------

    removeReference(reference:RotationReference, topic: RotationTopic){
        reference.enabled = false;
        this.updateReferenceInArray(reference, topic);
    }

    editReference(reference: RotationReference): void {
        reference.editing = !reference.editing;

        this.topicForm.get('referenceName').setValue(reference.name);
    }

    cancelExpandReference(reference: RotationReference, topic: RotationTopic){
        reference.expand = false;

        this.updateReferenceInArray(reference, topic);
        this.updateReference(reference);
    }

    cancelReferenceEdit(reference: RotationReference){
        reference.editing = !reference.editing;
    }

    updateReferenceInArray(reference: RotationReference, topic: RotationTopic){
        let updateReference = topic.references.find(t=> t.id == reference.id);
        let index = topic.references.indexOf(updateReference);
        topic.references[index] = reference;

        this.rotationReferenceService.updateRotationReference(reference);
    }

    pinnedReference(reference: RotationReference, topic: RotationTopic){
        reference.isPinned = !reference.isPinned;
        this.updateReferenceInArray(reference, topic);
    }

    checkedReference(reference: RotationReference, topic: RotationTopic){
        reference.checked = !reference.checked;
        this.updateReferenceInArray(reference, topic);
    }

    updateReference(reference: RotationReference){
        reference.editing = false;
        this.rotationReferenceService.updateRotationReference(reference);
    }

    displayRefFn(reference?: RotationReference): string | undefined {
        return reference ? reference.name : undefined;
    }

    onSelectAddReference(event: any): void {
        var reference = event.option.value;

        this.topicForm.controls['referenceName'].setValue(reference);
        this.topicForm.controls['description'].setValue(reference);

    }

    dropReference(event: CdkDragDrop<RotationReference[]>, references: RotationReference[], section: HandoverSection): void {
    
        moveItemInArray(references, event.previousIndex, event.currentIndex);
    
        references.forEach((x, index) => {
          x.index = index
        });

        if(section.sortReferenceType == SortType.alphabetically){
            section.sortReferenceType = SortType.index;
            this.handoverSectionService.updateSection(section);
        }
            //update index for references
    }

    expandNotes(reference: RotationReference): void{
        reference.expand = true;
    }

    clickOutside(reference: RotationReference, topic: RotationTopic, description: any) {
        reference.description = description.trim();
        reference.expand = false;
        this.updateReference(reference);
        this.updateReferenceInArray(reference, topic);
      }
}
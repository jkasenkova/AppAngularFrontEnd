import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
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
import { ClickOutsideDirective } from '../../../shared/clickoutside.directive';
import { SectionType } from "src/app/models/sectionType";
import { AddTopicComponent } from "../add-topic/add-topic.component";

@Component({
    selector: 'topic',
    standalone: true,
    imports: [
        FormsModule,
        MatAutocompleteModule,
        MatInputModule,
        DragDropModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatTooltipModule,
        CommonModule,
        MatIconModule,
        ClickOutsideDirective,
        AddTopicComponent
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
    references: RotationReference[];

    @Output() sectionOut: HandoverSection;

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
    }

    ngOnInit(): void {
    }
    //----------------------Section Dialogs--------------------------

    createSectionDialog(): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
             data: { 
                handoverId: this.handoverOut.handoverId 
            },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
               var newSection: HandoverSection = {
                    handoverId: this.handoverOut.handoverId,
                    sectionId: '',//Guid.create(),
                    sectionName: result.sectionName,
                    iHandoverSection: false,
                    sectionType: SectionType.Other,
                    addBtnShow:true,
                    sortReferenceType: SortType.alphabetically,
                    sortType: SortType.alphabetically,
                    templateSection: false,
                    appendAddItemLine: false,
                    sectionTopics: []
               };
              
               this.handoverOut.sections.push(newSection);

               this.handoverOut.sections = this.handoverOut.sections.sort((a, b) => a.sectionName.localeCompare(b.sectionName));

               this.handoverSectionService.createSection(newSection);
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
                this.handoverSectionService.deleteSection(result.sectionId);

                const sectionDeleted = this.handoverOut.sections.findIndex(s => s.sectionId == result.sectionId);
                if (sectionDeleted > -1) {
                    this.handoverOut.sections.splice(sectionDeleted, 1);
                }
            }
        });
    }


    //-----------------------------Topics--------------------------------

    editTopic(topic: RotationTopic): void{
        topic.editing = !topic.editing;

        this.topicForm.get('topicName').setValue(topic.name);
    }

    toggleDiv(show: boolean, section: HandoverSection, index: number): void {
       this.addHideRowTopicForm(section, index);
    }

    addHideRowTopicForm(section: HandoverSection, index: number): void{
        let nativeElement = this.addRowElement.toArray()[index].nativeElement;
        
        nativeElement.style.display =
          nativeElement.style.display === "none" || !nativeElement.style.display
          ? "inline-block"
            : "none";

             if(nativeElement.style.display !== "none"){
                section.addBtnShow = false;
            }else{
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
    
    updateTopic(topic: RotationTopic, section: HandoverSection){
        topic.editing = !topic.editing;

        topic.name = this.topicForm.get('topicName').value;
        this.updateTopicInArray(topic, section);
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
        this.updateReference(reference, topic);
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

    updateReference(reference: RotationReference, topic: RotationTopic){
        reference.editing = false;

        reference.name = this.topicForm.get('referenceName').value;

        this.updateReferenceInArray(reference, topic);
    }

    displayRefFn(reference?: RotationReference): string | undefined {
        return reference ? reference.name : undefined;
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
        this.topicForm.get('referenceName').setValue(reference.name);
        reference.expand = true;
    }

    clickOutside(reference: RotationReference, topic: RotationTopic, description: any) {
        reference.description = description.trim();
        reference.expand = false;
        this.updateReference(reference, topic);
        this.updateReferenceInArray(reference, topic);
    }
}
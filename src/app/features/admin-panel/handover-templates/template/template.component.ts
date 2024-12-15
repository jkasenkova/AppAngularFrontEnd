import { Component, ElementRef, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChildren, ViewEncapsulation, inject } from '@angular/core';
import { Template } from '../../../../models/template';
import { Section } from '../../../../models/section';
import { SectionService } from '../../../../services/sectionService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { SortType } from 'src/app/models/sortType';
import { AgGridAngular } from 'ag-grid-angular';
import { TemplateTopic } from 'src/app/models/templateTopic';
import {CdkDragDrop, DragDropModule, moveItemInArray} from '@angular/cdk/drag-drop';
import { Reference } from 'src/app/models/reference';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormControl  } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CreateSectionDialogComponent } from '../dialogs/section/create-section/create-section-dialog.component';
import { EditSectionDialogComponent } from '../dialogs/section/edit-section/edit-section-dialog.component';
import { DeleteSectionDialogComponent } from '../dialogs/section/delete-section/delete-section-dialog.component';
import { SectionType } from 'src/app/models/sectionType';
import { AddTopicComponent } from './add-topic/add-topic.component';
import { TemplateTopicService } from 'src/app/services/templateTopicService';
import { TemplateReferenceService } from 'src/app/services/templateReferenceService';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClickOutsideDirective } from 'src/app/shared/clickoutside.directive';

@Component({
    selector: 'app-template',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIconModule,
        MatButtonModule,
        AgGridAngular,
        DragDropModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        AddTopicComponent,
        CommonModule,
        MatTooltipModule,
        ClickOutsideDirective
    ],
    templateUrl: './template.component.html',
    styleUrls: ['template.component.less']
})

export class TemplateComponent implements OnInit, OnChanges {
    isSelectedTemplate: boolean = false;
    @Input() selectedTemplate?: Template;
    sections?: Section[];
    readonly dialog = inject(MatDialog);
    @ViewChildren("addRowElement") addRowElement: QueryList<ElementRef>;
    topicForm: FormGroup;
    enableAddTopicBtn: boolean = true;
    references: Reference[];
    @Output() sectionOut: Section;

    constructor(
      private sectionService: SectionService, 
      private templatTopicService: TemplateTopicService,
      private templatReferenceService: TemplateReferenceService,
      private fb: FormBuilder
    ) {

        this.topicForm = this.fb.group({
          topicName: new FormControl(),
          referenceName: new FormControl(),
          description: new FormControl()
      });
     }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['selectedTemplate']) {
        this.selectedTemplate = changes['selectedTemplate'].currentValue;
        this.getTemplateSections(this.selectedTemplate);
      }
    }

    ngOnInit(): void {
        if (this.selectedTemplate) {
            this.isSelectedTemplate = true;
            this.getTemplateSections(this.selectedTemplate);
        }
    }

    getTemplateSections(template: Template): void{
        this.sectionService.getSections(template.id).subscribe(sections => 
          {
            this.sections = this.sortSectionsByTypeAndName(sections);
            this.sections.forEach(section => 
            {
              this.templatTopicService.getTemplateTopicsBySectionId(section.id).subscribe(topics =>
              {
                section.sectionTopics = topics;
                if(section.sortTopicType == 1){
                  section.sectionTopics = section.sectionTopics.sort((a,b) => a.index - b.index);
                }else{
                  section.sectionTopics = section.sectionTopics.sort((a,b) => a.name.localeCompare(b.name))
                }
              })
            });
        });
    }

    sortSectionsByTypeAndName(sections: Section[]) {
      return sections.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
    }

    toggleDiv(section: Section, index: number): void {
      this.addHideRowTopicForm(section, index);
    }

    //---------Section Dialogs------------

    createSectionDialog(templateId: Guid): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
            data: 
            { 
              templateId: templateId,
              sections: this.sections 
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

              var newSection: Section = {
                name: result.name,
                templateId: result.templateId,
                type: SectionType.Other
              };
              this.sectionService.createSection(newSection).subscribe(newSection =>{
                if(this.sections != null){
                  this.sections.push(newSection);
                }
                else{
                  this.sections = [];
                  this.sections.push(newSection);
                }
              });
            }
        });
    }

    editSectionDialog(section: Section): void {
        const dialogRef = this.dialog.open(EditSectionDialogComponent, {
            data: 
            { 
              id: section.id, 
              sectionName: section.name,
              sections: this.sections 
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              var updtSection: Section = {
                id: result.id,
                name: result.name,
                templateId: section.templateId,
                type: section.type,
                sortTopicType: section.sortTopicType,
                sortReferenceType: section.sortReferenceType
              };
              this.sectionService.updateSection(updtSection);

              let updateSection = this.sections.find(l=> l.id == result.id);
              let index = this.sections.indexOf(updateSection);
              this.sections[index].name = result.name;
            }
        });
    }

    deleteSectionDialog(section: Section): void {
        const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
            data: 
            { 
              id: section.id, 
              name: section.name 
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.sectionService.deleteSection(section.id);
              this.sections = this.sections.filter(t=> t.id != section.id);
            }
        });
    }

    ///-----------Topics------------------

  addHideRowTopicForm(section: Section, index: number){
        let nativeElement = this.addRowElement.toArray()[index].nativeElement;
        
        nativeElement.style.display =
          nativeElement.style.display === "none" || !nativeElement.style.display
          ? "inline-block"
            : "none";

             if(nativeElement.style.display !== "none"){
                this.enableAddTopicBtn = false;
            }else{
                this.enableAddTopicBtn = true;
            }
    
  }

  editTopic(topic: TemplateTopic): void{
      topic.editing = !topic.editing;

      this.topicForm.get('topicName').setValue(topic.name);
  }

  updateTopic(topic: TemplateTopic, section: Section){
    topic.editing = !topic.editing;

    topic.name = this.topicForm.get('topicName').value;
    this.updateTopicInArray(topic, section);
  }

  updateTopicInArray(topic: TemplateTopic, section: Section){
    let updateTopic = section.sectionTopics.find(t=> t.id == topic.id);
    let index = section.sectionTopics.indexOf(updateTopic);
    section.sectionTopics[index] = topic;

    this.templatTopicService.updateTopic(topic);
  }

    selectReference(reference: Reference) {
        this.enableAddTopicBtn = true;
    }

    getCountReferences(topic: TemplateTopic): number {
        return topic.templateReferences != null ? topic.templateReferences.filter(t => t.enabled).length : 0;
    }
    
    expanded(topic: TemplateTopic): boolean {
      return topic.templateReferences != null ? topic.templateReferences.filter(t => t.enabled).length > 0 : false;
    }

    dropTopic(event: CdkDragDrop<TemplateTopic[]>, topics: TemplateTopic[], section: Section) {
      moveItemInArray(topics, event.previousIndex, event.currentIndex);

      var movedTopic = event.item.data as TemplateTopic;

      if(section.sortTopicType != 1)
      {
        section.sortTopicType = 1;
        this.sectionService.updateSection(section);
      }
      
      const targetIndex = topics.findIndex(item => item === movedTopic);
        if (targetIndex !== -1) {
          if(targetIndex !== 0){
            const beforeItems = topics.slice(0, targetIndex);

            beforeItems.forEach((item, index) => {
              item.index = index;
            });

            const afterItems = topics.slice(targetIndex + 1);

            afterItems.forEach((item, index) => {
              item.index = targetIndex + 1;
            });

            topics = beforeItems.concat(afterItems);
            movedTopic.index = event.currentIndex;
            topics.push(movedTopic);
          }
        }

      section.sectionTopics = topics.sort((a,b) => a.index - b.index);

      this.templatTopicService.updateOrderTopics(section.sectionTopics);
    }

    dropReference(event: CdkDragDrop<Reference[]>, references: Reference[], section: Section) {
    
        moveItemInArray(references, event.previousIndex, event.currentIndex);
    debugger;
        references.forEach((x, index) => {
          x.index = index
        });
    
        section.sortReferenceType = SortType.index;
      //update
    }

    onSelectAddTopic(event: any){
        var topic = event.option.value;
        this.references = topic.references;

        this.topicForm.controls['topic'].setValue(topic);

    }

    onSelectAddReference(event: any){
        var reference = event.option.value;

        this.topicForm.controls['reference'].setValue(reference);

        this.topicForm.controls['description'].setValue(reference.description);
    }

    displayFn(topic?: TemplateTopic): string | undefined {
        return topic ? topic.name : undefined;
    }

    displayRefFn(reference?: Reference): string | undefined {
        return reference ? reference.name : undefined;
    }

    editReference(reference: Reference): void {
      reference.editing = !reference.editing;

      this.topicForm.get('referenceName').setValue(reference.name);
    }

    cancelReferenceEdit(reference: Reference){
      reference.editing = !reference.editing;
    }

    updateReference(reference: Reference, topic: TemplateTopic){
      reference.editing = false;
      reference.name = this.topicForm.get('referenceName').value;

      this.updateReferenceInArray(reference, topic);
    }

    updateReferenceInArray(reference: Reference, topic: TemplateTopic){
      let updateReference = topic.templateReferences.find(t=> t.id == reference.id);
      let index = topic.templateReferences.indexOf(updateReference);
      topic.templateReferences[index] = reference;
    
      this.templatReferenceService.updateTemplateReference(reference);
    }

    removeTopic(topic: TemplateTopic,  section: Section){
      topic.enabled = false;
      topic.sectionId = null;
      this.updateTopicInArray(topic, section);

      topic.templateReferences.filter(t=> t.enabled).forEach(reference =>{
        reference.enabled = false;
        this.templatReferenceService.updateTemplateReference(reference);
      });
    }

    removeReference(reference: Reference, topic: TemplateTopic){
      reference.enabled = false;
      this.updateReferenceInArray(reference, topic);
    }

    expandNotes(reference: Reference): void{
      this.topicForm.get('referenceName').setValue(reference.name);
      reference.expand = true;
    }

    
    clickOutside(reference: Reference, topic: TemplateTopic, description: any) {
      reference.description = description.trim();
      reference.expand = false;
      this.updateReference(reference, topic);
      this.updateReferenceInArray(reference, topic);
  }
}


import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation, inject } from '@angular/core';
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
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder  } from '@angular/forms';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { CreateSectionDialogComponent } from '../dialogs/section/create-section/create-section-dialog.component';
import { EditSectionDialogComponent } from '../dialogs/section/edit-section/edit-section-dialog.component';
import { DeleteSectionDialogComponent } from '../dialogs/section/delete-section/delete-section-dialog.component';
import { SectionType } from 'src/app/models/sectionType';

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
        MatAutocompleteModule
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

    constructor(
      private sectionService: SectionService, 
      private fb: FormBuilder
    ) {
        this.topicForm = this.fb.group({
            topic: null,
            reference: null,
            topicName: "",
            referenceName: "",
            description: ""
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
        this.sectionService.getSections(template.id).subscribe(sections => {
            this.sections = sections;
        });
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
                sortType: section.sortType,
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

    selectReference(reference: Reference) {
        this.enableAddTopicBtn = true;
      }


    getCountReferences(topic: TemplateTopic): number {
        return topic.references != null ? topic.references.filter(t => t.enabled).length : 0;
      }
    
      expanded(topic: TemplateTopic): boolean {
        return topic.references != null ? topic.references.filter(t => t.enabled).length > 0 : false;
      }

      dropTopic(event: CdkDragDrop<TemplateTopic[]>, topics: TemplateTopic[], section: Section) {
   
        moveItemInArray(topics, event.previousIndex, event.currentIndex);
    
        topics.forEach((x, index) => {
          x.index = index
        });
    
        section.sortReferenceType = SortType.index;
        //update
      }
    
      dropReference(event: CdkDragDrop<Reference[]>, references: Reference[], section: Section) {
    
        moveItemInArray(references, event.previousIndex, event.currentIndex);
    
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
}


import { Component, ElementRef, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation, inject } from '@angular/core';
import { Template } from '../../../../models/template';
import { Section } from '../../../../models/section';
import { SectionService } from '../../../../services/sectionService';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { SectionType } from 'src/app/models/sectionType';
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

export class TemplateComponent implements OnInit {
    isSelectedTemplate: boolean = false;
    @Input() selectedTemplate?: Template;
    sections?: Section[];
    readonly dialog = inject(MatDialog);
    @ViewChildren("addRowElement") addRowElement: QueryList<ElementRef>;
    topicForm: FormGroup;
    enableAddTopicBtn: boolean = true;
    references: Reference[];

    sectionListTemp: Section[] = [
        {
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
            sectionName: "Section 1",
            iHandoverSection: false,
            sectionType: SectionType.Other,
            addBtnShow:true,
            sortReferenceType: SortType.alphabetically,
            sectionTopics: [
                {
                sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                id:  Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                name: "topic 1",
                enabled: true,
                index: 0,
                editing:false,
                isExpand:false,
                references:[
                    {
                        id:Guid.parse("44c2144d-5e1a-4ac5-8e78-6bbac15ea7b0"),
                        templateTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                        name:"reference 1",
                        description: "description 1",
                        enabled: true,
                        index:0,
                        editing:false
                    },
                    {
                        id:Guid.parse("c79bf801-20ea-483a-adb5-de24c91397e7"),
                        templateTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                        name:"reference 2",
                        description: "description 2",
                        enabled: true,
                        index:0,
                        editing:false
                    }
                ]
              },
              {
                sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                id:  Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                name: "topic 2",
                enabled: true,
                index: 0,
                editing:false,
                isExpand:false,
                references:[ 
                {
                    id:Guid.parse("20905156-1c40-49c5-a52e-46c6ea4a9094"),
                    templateTopicId:Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                    name:"reference 1",
                    description: "description 1",
                    enabled: true,
                    index:0,
                    editing:false
                },
                {
                    id:Guid.parse("8cec9d77-7d57-4182-bfe8-c54fcd89d696"),
                    templateTopicId:Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                    name:"reference 2",
                    description: "description 2",
                    enabled: true,
                    index:0,
                    editing:false
                }]
              }]
        },
        {
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            sectionId: Guid.parse("dcb40955-4752-40a1-9291-ea3ddf707da1"),
            sectionName: "Section 2",
            iHandoverSection: false,
            sectionType: SectionType.Other,
            addBtnShow:true,
            sortReferenceType: SortType.alphabetically,
            sectionTopics: [
                {
                sectionId: Guid.parse("dcb40955-4752-40a1-9291-ea3ddf707da1"),
                id:  Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                name: "topic 1",
                enabled: true,
                index: 0,
                editing:false,
                isExpand:false,
                references:[ 
                    {
                        id:Guid.parse("20905156-1c40-49c5-a52e-46c6ea4a9094"),
                        templateTopicId:Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                        name:"reference 1",
                        description: "description 1",
                        enabled: true,
                        index:0,
                        editing:false
                    },
                    {
                        id:Guid.parse("c76780e5-0f12-48c1-9d5b-54249b1688c6"),
                        templateTopicId:Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                        name:"reference 2",
                        description: "description 2",
                        enabled: true,
                        index:0,
                        editing:false
                    }]
              },
              {
                sectionId: Guid.parse("dcb40955-4752-40a1-9291-ea3ddf707da1"),
                id:  Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                name: "topic 2",
                enabled: true,
                index: 0,
                editing:false,
                isExpand:false,
                references:[ 
                    {
                        id:Guid.parse("8687a1d0-3476-4995-ac8b-f83f968f47c9"),
                        templateTopicId:Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                        name:"reference 1",
                        description: "description 1",
                        enabled: true,
                        index:0,
                        editing:false
                    },
                    {
                        id:Guid.parse("8687a1d0-3476-4995-ac8b-f83f968f47c9"),
                        templateTopicId:Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                        name:"reference 2",
                        description: "description 2",
                        enabled: true,
                        index:0,
                        editing:false
                    }]
              }]
        }
    ];

    constructor(private sectionService: SectionService, private fb: FormBuilder) {
        this.topicForm = this.fb.group({
            topic: null,
            reference: null,
            topicName: "",
            referenceName: "",
            description: ""
        });
     }

    ngOnInit(): void {
        if (this.selectedTemplate) {
            this.isSelectedTemplate = true;

            this.sections = this.sectionListTemp;

            this.getTemplateSections(this.selectedTemplate);
        }
    }

    getTemplateSections(template: Template): void{
        this.sectionService.getSections(template.id).subscribe(sections => {
            template.sections = sections;
            this.sections = sections;
        })
    }

    //---------Section Dialogs------------

    createSectionDialog(templateId: Guid): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
            data: { templateId: templateId, sectionName: '' },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              
            }
        });
    }

    editSectionDialog(section: Section): void {
        debugger;
        const dialogRef = this.dialog.open(EditSectionDialogComponent, {
            data: { sectionId: section.sectionId, sectionName: section.sectionName },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {

            }
        });
    }

    deleteSectionDialog(section: Section): void {
        const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
            data: { sectionId: section.sectionId, sectionName: section.sectionName },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
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
                section.addBtnShow = false;
            }else{
                this.enableAddTopicBtn = true;
                section.addBtnShow = true;
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
    
        section.sortType = SortType.index;
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


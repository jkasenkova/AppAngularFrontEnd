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
        debugger;
        if (this.selectedTemplate) {
            this.isSelectedTemplate = true;
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


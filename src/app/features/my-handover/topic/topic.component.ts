import { AfterContentInit, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RotationSection } from "src/app/models/handoverSection";
import { RotationReferenceService } from "src/app/services/rotationReferenceService";
import { RotationTopicService } from "src/app/services/rotationTopicService";
import { CreateSectionDialogComponent } from "../dialogs/sections/create-section/create-section.component";
import { MatDialog } from "@angular/material/dialog";
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
import { catchError, defaultIfEmpty, forkJoin, lastValueFrom, map, Observable, of, switchMap, tap } from "rxjs";
import { RotationSectionService } from "@services/rotationSectionService";

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

export class TopicComponent implements OnInit, OnChanges  {
    @Input() handover: Handover; 
    sections$: Observable<HandoverSection[]>;
    topics$: Observable<RotationTopic[]>;
    topicForm: FormGroup;
    addTopicForm: FormGroup;
    readonly dialog = inject(MatDialog);
    @ViewChildren("addRowElement") addRowElement: QueryList<ElementRef>;

    @Input() sections: RotationSection[] = [];
    @Input() expandAll: boolean = false;
    displayedSections: RotationSection[] = [];

    constructor(
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
        private handoverSectionService: RotationSectionService, 
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef) 
    {
            this.topicForm = this.fb.group({
                topicName: new FormControl(),
                referenceName: new FormControl(),
                description: new FormControl()
            });
    }

    ngOnInit(): void {
        this.displayedSections = [...this.sections];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['sections'] && changes['sections'].currentValue) {
          this.displayedSections = [...changes['sections'].currentValue];

          if(this.handover){
            this.processSections(this.handover.id);
          }
        }
        if (changes['expandAll']) {
           this.expandAll = changes['expandAll'].currentValue;
        }
    }

    onSectionUpdated(updatedSection: any, index: number) {
        this.sections[index] = updatedSection;
      }

    private processSections(handoverId: string): void {
        this.handoverSectionService.getSections(handoverId).pipe(
          tap((sections: RotationSection[]) => {
            this.displayedSections = sections
          }),
          switchMap((sections: RotationSection[]) => {
            const sectionRequests = sections.map((section) =>
              this.processSection(section)
            );
            return forkJoin(sectionRequests);
          })
        ).subscribe({
          next: (updatedSections: RotationSection[]) => {
            this.displayedSections = updatedSections;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error processing sections:', err);
          },
        });
      }
    
      private processSection(section: RotationSection): Observable<RotationSection> {
        return this.rotationTopicService.getTopicsBySectionId(section.id).pipe(
          switchMap((topics: RotationTopic[]) => {
            const otherTopicExists = topics.some((topic) => topic.name === 'Other');
            if (otherTopicExists == false) {
              const newTopic: RotationTopic = 
              { 
                name: 'Other', 
                sectionId: section.id, 
                enabled: false,
                index: 0,
                isPinned: false,
                editing: false,
                isExpand: false,
                whitePin: false,
                checked: false,
            };
              return this.rotationTopicService.addRotationTopic(newTopic).pipe(
                map((savedTopic: RotationTopic) => [...topics, savedTopic])
              );
            }
            return of(topics);
          }),
          switchMap((topicsWithOther: RotationTopic[]) => {
            const topicsWithReferences$ = topicsWithOther.map((topic) =>
              this.rotationReferenceService.getRotationReferences(topic.id).pipe(
                map((rotationReferences: RotationReference[]) => ({
                  ...topic,
                  rotationReferences,
                }))
              )
            );
    
            return forkJoin(topicsWithReferences$).pipe(
              map((topicsWithReferences) => ({
                ...section,
                topics: topicsWithReferences, 
              }))
            );
          }),
          catchError((error) => {
            console.error(`Error processing section ${section.id}:`, error);
            return of(section);
          })
        );
      }
    //----------------------Section Dialogs--------------------------

    createSectionDialog(): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
             data: { 
                handoverId: this.handover.id 
            },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.createRotationSection(result);
            }
        });
    }

    createRotationSection(result: any): void {
        const newSection: RotationSection = {
            rotationId: this.handover.id,
            id: '',
            templateSection: false,
            name: result.sectionName,
            addBtnShow: true,
            type: SectionType.Other,
            sortReferenceType: SortType.alphabetically,
            sortTopicType: SortType.alphabetically,
            topics: []
        };
        this.addRotationSectionWithTopic(newSection);
    }

    addRotationSectionWithTopic(newSection: RotationSection): void {
        this.handoverSectionService.createSection(newSection).subscribe({
          next: (createdSection: RotationSection) => {
            const otherTopic: RotationTopic = 
            { 
              name: 'Other', 
              sectionId: createdSection.id, 
              enabled: false,
              index: 0,
              isPinned: false,
              editing: false,
              isExpand: false,
              whitePin: false,
              checked: false,
          };
    
            this.rotationTopicService.addRotationTopic(otherTopic).subscribe({
              next: (createdTopic: RotationTopic) => {
                if (!createdSection.topics) {
                  createdSection.topics = [];
                }
                createdSection.topics.push(createdTopic);
                this.displayedSections.push(createdSection);
                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error creating topic "Other":', err);
              }
            });
          },
          error: (err) => {
            console.error('Error creating section:', err);
          }
        });
    }

    editSectionDialog(section: RotationSection): void {
        const dialogRef = this.dialog.open(EditSectionDialogComponent, {
            data: { 
                sectionId: section.id, 
                sectionName: section.name 
            },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let updateSection = this.displayedSections.find(t => t.id == result.sectionId);
                let index = this.displayedSections.indexOf(updateSection);
                this.displayedSections[index].name = result.sectionName;
                this.cdr.detectChanges();

                const newSection: RotationSection = {
                    rotationId: this.handover.id,
                    id: result.sectionId,
                    name: result.sectionName,
                    templateSection: false,
                    addBtnShow: true,
                    type: SectionType.Other,
                    sortReferenceType: SortType.alphabetically,
                    sortTopicType: SortType.alphabetically,
                    topics: []
                };
                this.handoverSectionService.updateSection(newSection).subscribe();
            }
        });
    }

    deleteSectionDialog(section: RotationSection): void {
        const dialogRef = this.dialog.open(DeleteSectionDialogComponent, {
            data: { sectionId: section.id, sectionName: section.name },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handoverSectionService.deleteSection(result.sectionId);

                const sectionDeleted = this.displayedSections.findIndex(s => s.id == result.sectionId);
                if (sectionDeleted > -1) {
                    this.displayedSections.splice(sectionDeleted, 1);
                    this.cdr.detectChanges();
                }
            }
        });
    }

    //-----------------------------Topics--------------------------------

    expandTopic(topic: RotationTopic): void {
        topic.isExpand = !topic.isExpand;
    }

    editTopic(topic: RotationTopic): void{
        topic.editing = !topic.editing;

        this.topicForm.get('topicName').setValue(topic.name);
    }

    toggleDiv(section: RotationSection, index: number): void {
       this.addHideRowTopicForm(section, index);
    }

    addHideRowTopicForm(section: RotationSection, index: number): void{
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
        return topic.rotationReferences != null ? topic.rotationReferences.filter(t => t.enabled).length : 0;
    }
    
    expanded(topic: RotationTopic): boolean {
        return topic.rotationReferences != null ? topic.rotationReferences.filter(t => t.enabled).length > 0 : false;
    }

    dropTopic(event: CdkDragDrop<RotationTopic[]>, topics: RotationTopic[], section: RotationSection): void {
   
        moveItemInArray(topics, event.previousIndex, event.currentIndex);
    
        topics.forEach((x, index) => {
          x.index = index
        });
    
        if(section.sortTopicType == SortType.alphabetically){
            section.sortTopicType = SortType.index;
            this.handoverSectionService.updateSection(section);
        }

        //update index for topics
    }
    
    updateTopic(topic: RotationTopic, section: RotationSection){
        topic.editing = !topic.editing;
        topic.isExpand = true;
        topic.name = this.topicForm.get('topicName').value;
        this.updateTopicInArray(topic, section);
    }

    async checkedTopic(topic: RotationTopic, section: RotationSection): Promise<void>{
        topic.checked = !topic.checked;

        if (topic.rotationReferences && topic.rotationReferences.length > 0) {
            topic.rotationReferences.forEach(ref => (ref.checked = topic.checked));
      
            const updateRequests = topic.rotationReferences.map(ref =>
              this.rotationReferenceService.updateRotationReference(ref).pipe(
                catchError(error => {
                  console.error('Error during update rotationReference:', error);
                  return of(null); 
                })
              )
            );
      
            try {
              const results = await forkJoin(updateRequests).toPromise();
    
              const failedUpdates = results.filter(result => result === null).length;
              if (failedUpdates > 0) {
                console.warn(`Failed to update ${failedUpdates} rotationReferences.`);
              } 
            } catch (error) {
              console.error('Error while executing queries:', error);
            }
        }

        this.updateTopicInArray(topic, section);
    }

    updateTopicInArray(topic: RotationTopic, section: RotationSection): void {
        try {
          const index = section.topics.findIndex(t => t.id === topic.id);
      
          if (index !== -1) {
            section.topics = [
              ...section.topics.slice(0, index),
              topic,
              ...section.topics.slice(index + 1)
            ];
      
            this.rotationTopicService.updateTopic(topic).subscribe();
          } else {
            console.warn('Topic not fined:', topic.id);
          }
        } catch (error) {
          console.error('Error updating topic:', error);
        }
    }

    async topicPinned(topic: RotationTopic, section: RotationSection): Promise<void>{
        topic.isPinned = !topic.isPinned;

        if (topic.rotationReferences && topic.rotationReferences.length > 0) {
            topic.rotationReferences.forEach(ref => (ref.isPinned = topic.isPinned));
      
            const updateRequests = topic.rotationReferences.map(ref =>
              this.rotationReferenceService.updateRotationReference(ref).pipe(
                catchError(error => {
                  console.error('Error during update rotationReference:', error);
                  return of(null); 
                })
              )
            );
      
            try {
              const results = await forkJoin(updateRequests).toPromise();
    
              const failedUpdates = results.filter(result => result === null).length;
              if (failedUpdates > 0) {
                console.warn(`Failed to update ${failedUpdates} rotationReferences.`);
              } 
            } catch (error) {
              console.error('Error while executing queries:', error);
            }
        }

       this.updateTopicInArray(topic, section);
    }

    async removeTopic(topic: RotationTopic,  section: RotationSection): Promise<void>{
        topic.enabled = false;

        if (topic.rotationReferences && topic.rotationReferences.length > 0) {
            topic.rotationReferences.forEach(ref => (ref.enabled = topic.enabled));
      
            const updateRequests = topic.rotationReferences.map(ref =>
              this.rotationReferenceService.updateRotationReference(ref).pipe(
                catchError(error => {
                  console.error('Error during update rotationReference:', error);
                  return of(null); 
                })
              )
            );
      
            try {
              const results = await forkJoin(updateRequests).toPromise();
    
              const failedUpdates = results.filter(result => result === null).length;
              if (failedUpdates > 0) {
                console.warn(`Failed to update ${failedUpdates} rotationReferences.`);
              } 
            } catch (error) {
              console.error('Error while executing queries:', error);
            }
        }

        this.updateTopicInArray(topic, section);
    }

    //----------------References--------------------

    removeReference(reference:RotationReference, topic: RotationTopic, section: RotationSection){
        reference.enabled = false;
        if(topic.rotationReferences.length == 1){
            this.removeTopic(topic, section);
        }
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
        const index = topic.rotationReferences.findIndex(ref => ref.id === reference.id);

        if (index !== -1) {
          topic.rotationReferences = [
            ...topic.rotationReferences.slice(0, index),
            reference,
            ...topic.rotationReferences.slice(index + 1),
          ];
 
          this.rotationReferenceService.updateRotationReference(reference)
            .pipe(
              catchError(error => {
                console.error('Error during update reference:', error);
                return of(null);
              })
            ).subscribe();
        }
        topic.rotationReferences = this.sortRotationReferences(topic.rotationReferences);
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

    dropReference(event: CdkDragDrop<RotationReference[]>, references: RotationReference[], section: RotationSection): void {
    
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

    sortRotationReferences(references: RotationReference[]): RotationReference[] {
        return references.sort((a, b) => {
          if (a.whitePin !== b.whitePin) {
            return a.whitePin ? -1 : 1;
          }
          return a.name.localeCompare(b.name);
        });
    }

    sortTopics(topics: RotationTopic[]): RotationTopic[] {
        if(topics){
            return topics.sort((a, b) => {
                if (a.whitePin !== b.whitePin) {
                  return a.whitePin ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
              });
        }
        else{
            return [];
        }
      }
}
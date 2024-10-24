import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Guid } from "guid-typescript";
import { Handover } from "src/app/models/handover";
import { Reference } from "src/app/models/reference";
import { RotationTopic } from "src/app/models/rotationTopic";
import { SectionType } from "src/app/models/sectionType";
import { SortType } from "src/app/models/sortType";
import { CreateSectionDialogComponent } from "./dialogs/sections/create-section/create-section.component";
import { EditSectionDialogComponent } from "./dialogs/sections/edit-section/edit-section.component";
import { DeleteSectionDialogComponent } from "./dialogs/sections/delete-section/delete-section.component";
import { UserModel } from "src/app/models/user";
import { MatTooltipModule } from '@angular/material/tooltip';
import { HandoverSection } from "src/app/models/handoverSection";
import { RotationReference } from "src/app/models/rotationReference";
import { HandoverSectionService } from "src/app/services/handoverSectionService";
import { HandoverRecipientDialogComponent } from "./dialogs/recipient/handover-recipient.component";
import { DatesShiftDialogComponent } from "./dialogs/dates/dates-shift.component";
import { ShareReportDialogComponent } from "./dialogs/share-report/share-report.component";
import { HandoverService } from "src/app/services/handoverService";
import { CommonModule } from '@angular/common';
import { ReportCommentsDialogComponent } from "./dialogs/report-comments/report-comments.component";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { CommentsService } from "src/app/services/commentsService";
import { UserService } from "src/app/services/userService";
import { MyTeamService } from "src/app/services/myTeamService";

@Component({
    selector: 'app-my-handover',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        DragDropModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatTooltipModule,
        CommonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-handover.component.html',
    styleUrls: ['./my-handover.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class MyHandoverComponent implements OnInit {
    handover: Handover;
    @ViewChildren("addRowElement") addRowElement: QueryList<ElementRef>;
    topicForm: FormGroup;
    enableAddTopicBtn: boolean = true;
    references: Reference[];
    readonly dialog = inject(MatDialog);
    owner: UserModel;
    recipient: UserModel;
    expandAll: boolean = false;
    isMyRotation: boolean = false;
    countShare: number;

    @Input() handoverAdmin: boolean; 

    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    
    userTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            ownerRole: "Developer",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            userId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
            ownerRole: "Team Lead",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            userId: Guid.parse("f06e7c51-43e7-4c8d-b7dd-42c668384bc3"),
            ownerRole: "Product Manager",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        }
    ]

    teamUserTmp: MyTeamModel = {
        ownerName: "Julia Kasenkova",
        ownerEmail: "jkasenkova@gmail.com",
        userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        ownerRole: "Developer",
        isActiveRotation: true, //get state from back by curentRotationId
        recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        selected: false
    };

    
    handoverTmp: Handover =
        {
            templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
            ownerId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            recipientId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
            createDate: new Date().toLocaleDateString(undefined, this.options),
            endDate: new Date().toLocaleDateString(undefined, this.options),
            liveRotation: true,
            sections:  [
                {
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
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
                        isPinned: false,
                        references:[
                            {
                                id:Guid.parse("44c2144d-5e1a-4ac5-8e78-6bbac15ea7b0"),
                                rotationTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                                name:"reference 1",
                                description: "description 1",
                                enabled: true,
                                index:0,
                                editing:false
                            },
                            {
                                id:Guid.parse("c79bf801-20ea-483a-adb5-de24c91397e7"),
                                rotationTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
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
                        isPinned: true,
                        index: 0,
                        editing:false,
                        isExpand:false,
                        references:[ 
                        {
                            id:Guid.parse("20905156-1c40-49c5-a52e-46c6ea4a9094"),
                            rotationTopicId:Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                            name:"reference 1",
                            description: "description 1",
                            enabled: true,
                            index:0,
                            editing:false
                        },
                        {
                            id:Guid.parse("8cec9d77-7d57-4182-bfe8-c54fcd89d696"),
                            rotationTopicId:Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                            name:"reference 2",
                            description: "description 2",
                            enabled: true,
                            index:0,
                            editing:false
                        }]
                      }]
                },
                {
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
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
                        isPinned: false,
                        isExpand:false,
                        references:[ 
                            {
                                id:Guid.parse("20905156-1c40-49c5-a52e-46c6ea4a9094"),
                                rotationTopicId:Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                                name:"reference 1",
                                description: "description 1",
                                enabled: true,
                                index:0,
                                editing:false
                            },
                            {
                                id:Guid.parse("c76780e5-0f12-48c1-9d5b-54249b1688c6"),
                                rotationTopicId:Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
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
                        isPinned: false,
                        isExpand:false,
                        references:[ 
                            {
                                id:Guid.parse("8687a1d0-3476-4995-ac8b-f83f968f47c9"),
                                rotationTopicId:Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                                name:"reference 1",
                                description: "description 1",
                                enabled: true,
                                index:0,
                                editing:false
                            },
                            {
                                id:Guid.parse("8687a1d0-3476-4995-ac8b-f83f968f47c9"),
                                rotationTopicId:Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                                name:"reference 2",
                                description: "description 2",
                                enabled: true,
                                index:0,
                                editing:false
                            }]
                      }]
                }
            ],
            shareEmails: ['user1@gmail.com', 'user2@gmail.com', 'user3@gmail.com']
        };

    constructor(
        private handoverSectionService: HandoverSectionService, 
        private handoverService: HandoverService,
        private commentsService: CommentsService,

        private fb: FormBuilder) 
        {
            this.topicForm = this.fb.group({
                topic: null,
                reference: null,
                topicName: "",
                referenceName: "",
                description: ""
            });
        }


    ngOnInit(): void {
    //  this.handover = this.handoverTmp;
      this.handover = this.initilizeHandover(this.handover);
    }

    initilizeHandover(handover: Handover):Handover{
        if(handover){
            if(handover.shareEmails){
                this.countShare = this.handover.shareEmails.length;
            }

            if(handover.shareUsers){
                this.countShare += this.handover.shareUsers.length;
            }
        }

        return handover;
    }

    expandCollapseItems(event:any){
        if(this.expandAll){
            this.expandAll = false;
            event.target.textContent  = "Expand All";
        }
        else{
            this.expandAll = true;
            event.target.textContent  = "Collapse All";
        }

       this.handover.sections.flatMap(s => s.sectionTopics).forEach(topic =>{
            topic.isExpand = this.expandAll;
        });
    }

     //---------Section Dialogs------------

    createSectionDialog(handoverId: Guid): void {
        const dialogRef = this.dialog.open(CreateSectionDialogComponent, {
             data: { handoverId: handoverId },
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
            data: { sectionId: section.sectionId, sectionName: section.sectionName },
             panelClass: 'section-dialog'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
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

     ///-----------Topics------------------
    
    addHideRowTopicForm(section: HandoverSection, index: number){
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


    getCountReferences(topic: RotationTopic): number {
        return topic.references != null ? topic.references.filter(t => t.enabled).length : 0;
      }
    
      expanded(topic: RotationTopic): boolean {
        return topic.references != null ? topic.references.filter(t => t.enabled).length > 0 : false;
      }

      dropTopic(event: CdkDragDrop<RotationTopic[]>, topics: RotationTopic[], section: HandoverSection) {
   
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
    
      dropReference(event: CdkDragDrop<RotationReference[]>, references: RotationReference[], section: HandoverSection) {
    
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

      displayFn(topic?: RotationTopic): string | undefined {
        return topic ? topic.name : undefined;
      }

      displayRefFn(reference?: RotationReference): string | undefined {
        return reference ? reference.name : undefined;
      }

      getLettersIcon(userId: Guid): string {
        //for test
        var user = this.userTmp.find(u=> u.userId.toString() == userId.toString());
        if(user){
            var getLetters = user.ownerName
                .split(" ")
                .map(n => n[0])
                .join("");

            return getLetters;
        }
        return "";

        //for related API
       /*  this.userService.getUser(userId).subscribe(user => {
            if(Boolean(user.userName) && Boolean(user.userSurname)){
                var getLetters = [user.userName[0] +  user.userSurname[0]].join("");
                return getLetters;
            }
            return "";
        });
        return ""; */
    }


    editRecipient(){
        const dialogRef = this.dialog.open(HandoverRecipientDialogComponent, { 
            data: this.handover
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
               
                this.handoverService.updateHandover(result);
                this.handover.recipientId = result.recipientId;

                this.initilizeHandover(this.handover);
            }
        });
    }

    editDates(){
        const dialogRef = this.dialog.open(DatesShiftDialogComponent, { 
            data: { 
                ownerId: this.teamUserTmp.userId, // get login user id
                handover: this.handover
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handoverService.updateHandover(result);
                this.handover.endDate = result.endDate;
            }
        });
    }

    shareReport(){
        this.handover.shareUsers = [];
        this.handover.shareUsers.push(this.teamUserTmp);

        const dialogRef = this.dialog.open(ShareReportDialogComponent, { 
            data: { 
                ownerId: this.handover.ownerId,
                handoverId: this.handover.handoverId,
                shareUsers: this.handover.shareUsers,
                shareEmails: this.handover.shareEmails
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handoverService.updateHandover(result);
            }
        });
    }

    shareUserInfo(): string{
        var title = 'Shared with: ';
        var arr = [""];

        if(this.handover.shareEmails){
            arr = arr.concat(this.handover.shareEmails);
        }

        if(this.handover.shareUsers){
            arr = arr.concat(this.handover.shareUsers.flatMap(u => u.ownerName));
        }

        return title + arr.toString().split(",").join('\n');
    }

    reportComments(){
        const dialogRef = this.dialog.open(ReportCommentsDialogComponent, { 
            data: { 
                handoverId: this.handover.handoverId
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.handover.reportComments = [];
              this.handover.reportComments.push(result);
              this.commentsService.addComment(result);
            }
        });
    }

    startHandover(){
        const dialogRef = this.dialog.open(DatesShiftDialogComponent, { 
            data: { 
                ownerId: this.teamUserTmp.userId, // get logn user id
                handover: this.handover
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handover = this.handoverTmp;
                this.handoverService.addHandover(result);
                this.editRecipient();
            }
        });
    }
}
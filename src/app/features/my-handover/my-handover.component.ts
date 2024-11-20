
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, ViewEncapsulation, Output} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Guid } from "guid-typescript";
import { Handover } from "src/app/models/handover";
import { RotationTopic } from "src/app/models/rotationTopic";
import { SectionType } from "src/app/models/sectionType";
import { SortType } from "src/app/models/sortType";
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
import { MyTeamService } from "src/app/services/myTeamService";
import { ShareReportModel } from "./models/sahareReportModel";
import { Template } from "src/app/models/template";
import { TemplateService } from "src/app/services/templateService";
import { TemplateTopic } from "src/app/models/templateTopic";
import { Section } from "src/app/models/section";
import { RotationTopicService } from "src/app/services/rotationTopicService";
import { RotationReferenceService } from "src/app/services/rotationReferenceService";
import { MatExpansionModule } from '@angular/material/expansion';
import { ViewUserPanelComponent } from "./view-user-panel/view-user-panel.component";
import { TopicComponent } from "./topic/topic.component";
import { expand } from "rxjs";
import { NavigationExtras, Router, RouterModule} from '@angular/router';
import { ReportPDFPreviewComponent } from "./report-preview/report-pdf-component";
import { MatTabsModule } from "@angular/material/tabs";
import { FinishRotationDialogComponent } from "./finish-rotation/finish-rotation.component";
import { RoleModel } from "src/app/models/role";
import { RoleService } from "src/app/services/roleService";
import { UserType } from "src/app/models/userType";
import { RotationType } from "src/app/models/rotationType";
import { ShiftPatternType } from "src/app/models/shiftPatternType";
import { DataService } from "src/app/services/data.service";
import { AuthFacade } from "src/app/services/auth/store/auth.facade";

@Component({
    selector: 'app-my-handover',
    standalone: true,
    imports: [
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatTooltipModule,
        CommonModule,
        MatExpansionModule,
        ViewUserPanelComponent,
        TopicComponent,
        RouterModule,
        ReportPDFPreviewComponent,
        MatTabsModule,
        FinishRotationDialogComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-handover.component.html',
    styleUrls: ['./my-handover.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class MyHandoverComponent implements OnInit {
    handover: Handover;
    owner: MyTeamModel;
    recipient: MyTeamModel; //for test
    teamMembers: MyTeamModel[] = [];
    template: Template;
    ownerRole: RoleModel;
    expandAll: boolean = false;
    countShare: number;
    isAdmin: boolean;
    
    readonly dialog = inject(MatDialog);
    @Output() ownerHandoveName: string;
    @Output() handoverOut: Handover;
    @Input() handoverAdmin: boolean; 

     //for test
    options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    handoverOwner: MyTeamModel = {
        ownerName: "Julia Kasenkova",
        ownerEmail: "jkasenkova@gmail.com",
        userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
        ownerRole: "Developer", // get by id role info
        ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        isActiveRotation: true, //get state from back by curentRotationId
        recipientId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        selected: false
    };
    
    usersTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
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
            ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
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
            ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
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
        ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
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
            endTime: new Date().toLocaleTimeString(),
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
                    sortType: SortType.alphabetically,
                    templateSection: false,
                    appendAddItemLine: false,
                    sectionTopics: [
                        {
                        sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                        id:  Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                        name: "topic 1",
                        enabled: true,
                        index: 0,
                        isExpand:false,
                        isPinned: true,
                        templateTopic: false,
                        checked: false,
                        editing: false,
                        references:[
                            {
                                id:Guid.parse("44c2144d-5e1a-4ac5-8e78-6bbac15ea7b0"),
                                rotationTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                                name:"AAAAA",
                                description: "AAAAA",
                                enabled: false,
                                index:0,
                                templateReference: false,
                                checked:false,
                                editing: false,
                                isPinned: false,
                                expand:false
                            },
                            {
                                id:Guid.parse("44c2144d-5e1a-4ac5-8e78-6bbac15ea7b0"),
                                rotationTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                                name:"reference 1",
                                description: "description 1",
                                enabled: true,
                                index:0,
                                templateReference: false,
                                checked:false,
                                editing: false,
                                isPinned: false,
                                expand:false
                            },
                            {
                                id:Guid.parse("c79bf801-20ea-483a-adb5-de24c91397e7"),
                                rotationTopicId:Guid.parse("0f6b0e0c-daa8-4930-be62-8b8ab5a4694f"),
                                name:"reference 2",
                                description: "description 2",
                                enabled: true,
                                index:0,
                                checked:false,
                                expand:false,
                                editing: false,
                                templateReference: false,
                                isPinned: false
                            }
                        ]
                      },
                      {
                        sectionId: Guid.parse("556e27c8-8bdc-4a46-ad48-6256953c08d9"),
                        id:  Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                        name: "topic 2",
                        enabled: true,
                        isPinned: true,
                        templateTopic: false,
                        editing: false,
                        index: 0,
                        isExpand:false,
                        checked: false,
                        references:[ 
                        {
                            id:Guid.parse("20905156-1c40-49c5-a52e-46c6ea4a9094"),
                            rotationTopicId:Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                            name:"reference 1",
                            description: "description 1",
                            editing: false,
                            enabled: true,
                            index:0,
                            expand:false,
                            templateReference: false,
                            checked:false,
                            isPinned: false
                        },
                        {
                            id:Guid.parse("8cec9d77-7d57-4182-bfe8-c54fcd89d696"),
                            rotationTopicId:Guid.parse("4df7c851-d6be-4a51-8b08-eddea4a1f03c"),
                            name:"reference 2",
                            description: "description 2",
                            enabled: true,
                            index:0,
                            expand:false,
                            templateReference: false,
                            editing: false,
                            checked:false,
                            isPinned: false
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
                    sortType: SortType.alphabetically,
                    appendAddItemLine: false,
                    sortReferenceType: SortType.alphabetically,
                    templateSection: false,
                    sectionTopics: [
                        {
                        sectionId: Guid.parse("dcb40955-4752-40a1-9291-ea3ddf707da1"),
                        id:  Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                        name: "topic 1",
                        enabled: true,
                        editing: false,
                        templateTopic: false,
                        index: 0,
                        checked: false,
                        isPinned: true,
                        isExpand:false,
                        references:[ 
                            {
                                id:Guid.parse("20905156-1c40-49c5-a52e-46c6ea4a9094"),
                                rotationTopicId:Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                                name:"reference 1",
                                description: "description 1",
                                enabled: true,
                                expand:false,
                                index:0,
                                editing: false,
                                checked:false,
                                templateReference: false,
                                isPinned: false
                            },
                            {
                                id:Guid.parse("c76780e5-0f12-48c1-9d5b-54249b1688c6"),
                                rotationTopicId:Guid.parse("6074e0af-b2d2-4d66-b3fd-b9e09377ba12"),
                                name:"reference 2",
                                description: "description 2",
                                enabled: true,
                                index:0,
                                checked:false,
                                editing: false,
                                expand:false,
                                templateReference: false,
                                isPinned: false
                            }]
                      },
                      {
                        sectionId: Guid.parse("dcb40955-4752-40a1-9291-ea3ddf707da1"),
                        id:  Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                        name: "topic 2",
                        enabled: true,
                        index: 0,
                        checked: false,
                        templateTopic: false,
                        editing: false,
                        isPinned: true,
                        isExpand:false,
                        references:[ 
                            {
                                id:Guid.parse("8687a1d0-3476-4995-ac8b-f83f968f47c9"),
                                rotationTopicId:Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                                name:"reference 1",
                                description: "description 1",
                                enabled: true,
                                index:0,
                                editing: false,
                                checked:false,
                                expand:false,
                                templateReference: false,
                                isPinned: false
                            },
                            {
                                id:Guid.parse("8687a1d0-3476-4995-ac8b-f83f968f47c9"),
                                rotationTopicId:Guid.parse("082be4c4-0939-486f-a6f0-47f39a523ef0"),
                                name:"reference 2",
                                description: "description 2",
                                enabled: true,
                                index:0,
                                checked:false,
                                templateReference: false,
                                editing: false,
                                expand:false,
                                isPinned: false
                            }]
                      }]
                }
            ],
            shareEmails: ['user1@gmail.com', 'user2@gmail.com', 'user3@gmail.com'],
            reportComments: [
                {
                    commentId: Guid.parse("df668eef-9275-4194-bb45-4c5e282a4d34"),
                    ownerId:Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
                    comment: "Comment 1",
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                    createDate: " 29.10.2024 22:10"
                },
                {
                    commentId: Guid.parse("bda98ec1-1e0f-45f9-be50-e01563232685"),
                    ownerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
                    comment: "Comment 2",
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                     createDate: " 29.10.2024 22:10"
                },
                {
                    commentId: Guid.parse("68c1c31c-0a1a-4bbf-922a-9f5096b8ae98"),
                    ownerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
                    comment: "Comment 3",
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                     createDate: " 29.10.2024 22:10"
                },
                {
                    commentId: Guid.parse("951afc76-e33b-481e-a2d9-923c70ac388c"),
                    ownerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
                    comment: "Comment 4",
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                     createDate: " 29.10.2024 22:10"
                },
                {
                    commentId: Guid.parse("83fdf091-031e-40ed-866b-18aebcbdb733"),
                    ownerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
                    comment: "Comment 5",
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                     createDate: " 29.10.2024 22:10"
                },
                {
                    commentId: Guid.parse("e8465f20-0866-4753-b3bd-12219a185726"),
                    ownerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
                    comment: "Comment 6",
                    handoverId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                     createDate: " 29.10.2024 22:10"
                }
            ]
    };

    templateTmp: Template = {
        templateName: "Template 1",
        templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
        sections: [
            {
                sectionName: "HSE",
                sectionId:  Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                iHandoverSection: false,
                sectionType: SectionType.HSE,
                sortType: SortType.alphabetically,
                sortReferenceType: SortType.alphabetically,
                sectionTopics: [
                    {
                        sectionId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                        id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                        name: "HSE",
                        enabled: true,
                        editing: false,
                        isExpand: false,
                        index: 0,
                        references: [
                            {
                                id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                templateTopicId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                name: "hse ref 1",
                                description: "hse description hse description",
                                enabled: true,
                                index: 0,
                                editing: false
                            },
                            {
                                id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                templateTopicId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                name: "hseref 2",
                                description: "hse description",
                                enabled: true,
                                index: 0,
                                editing: false
                            }
                        ]
                    }
                ]
            },
            {
                sectionName: "Core",
                sectionId:  Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                iHandoverSection: false,
                sectionType: SectionType.Core,
                sortType: SortType.alphabetically,
                sortReferenceType: SortType.alphabetically,
                sectionTopics: [
                    {
                        sectionId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                        id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                        name: "Core",
                        enabled: true,
                        editing: false,
                        isExpand: false,
                        index: 0,
                        references: [
                            {
                                id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                templateTopicId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                name: "core ref 1",
                                description: "core description",
                                enabled: true,
                                index: 0,
                                editing: false
                            },
                            {
                                id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                templateTopicId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                name: "core ref 2",
                                description: "core description",
                                enabled: true,
                                index: 0,
                                editing: false
                            }
                        ]
                    }
                ]
            },
            {
                sectionName: "Template Section",
                sectionId:  Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                templateId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                iHandoverSection: false,
                sectionType: SectionType.Other,
                sortType: SortType.alphabetically,
                sortReferenceType: SortType.alphabetically,
                sectionTopics: [
                    {
                        sectionId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                        id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                        name: "AAAAA",
                        enabled: true,
                        editing: false,
                        isExpand: false,
                        index: 0,
                        references: [
                            {
                                id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                templateTopicId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                name: "aaaa ref 1",
                                description: "aaaa description",
                                enabled: true,
                                index: 0,
                                editing: false
                            },
                            {
                                id: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                templateTopicId: Guid.parse("a2377f33-9e5d-46a7-a969-173fcd30ebb0"),
                                name: "aaaaa ref 2",
                                description: "aaaaa description",
                                enabled: true,
                                index: 0,
                                editing: false
                            }
                        ]
                    }
                ]
            }
        ],
        isHandoverTemplate: false
    }; 

    handoverRecipientTmp: MyTeamModel = {
        ownerName: "Peter Hlazunov",
        ownerEmail: "phlazunov@gmail.com",
        userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
        ownerRole: "Team Lead",
        ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        isActiveRotation: true, //get state from back by curentRotationId
        recipientId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        selected: false
    };

    roleTmp: RoleModel = {
        roleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        roleName: "Developer",
        locationId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        templateId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        userType: UserType.User,
        teamId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
        rotationType: RotationType.Shift,
        shiftPatternType: ShiftPatternType.hours8
    }

    constructor(
        private authFacade: AuthFacade,
        private router: Router,
        private handoverSectionService: HandoverSectionService, 
        private handoverService: HandoverService,
        private myTeamService: MyTeamService,
        private templateService: TemplateService,
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
        private roleService: RoleService,
        private dataService: DataService) 
        {
            this.owner = this.handoverOwner;//for test
        }

    ngOnInit(): void {

        this.authFacade.getIsAdmin().subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });

        this.isAdmin = true;

        this.loadData();
    }

    loadData(): void {
        if(this.owner){
            this.roleService.getRoleById(this.owner.ownerRoleId).subscribe(role => {
                this.ownerRole = role
            });
        }
      this.handover = this.handoverTmp;// for test
      this.ownerRole = this.roleTmp;//for test
      this.template = this.templateTmp;//for test
      this.handoverOut = this.handover;//for test
      this.teamMembers = this.usersTmp;// for test
      this.recipient = this.handoverRecipientTmp; // for test
      this.handover = this.setShareCounter(this.handover);// for test
      this.handover = this.initilizeTemplateSection(this.template, this.handover);// for test
      
      if(this.owner.isActiveRotation && this.owner.curentRotationId) {
            this.handoverService.getHandoverById(this.owner.curentRotationId).subscribe(rotation =>
            {
                this.handover = rotation;
                this.handoverOut = rotation

                this.handover = this.setShareCounter(this.handover);
              
            });
      }

      this.templateService.getTemplateById(this.ownerRole.templateId).subscribe(template =>{
        this.template = template;
        this.handover = this.initilizeTemplateSection(this.template, this.handover);
    });

        this.myTeamService.getTeamUsers().subscribe(teams => {
            this.teamMembers = teams;
        }); 
    }

    initilizeTemplateSection(template: Template, handover: Handover):Handover {

        template.sections.forEach(section => {

            var convertedSection: HandoverSection = { 
                sectionId: section.sectionId,
                sectionName: section.sectionName,
                handoverId: handover.handoverId,
                iHandoverSection: false,
                sectionType: section.sectionType,
                sortType: section.sortType,
                addBtnShow: true,
                sortReferenceType: section.sortReferenceType,
                templateSection: true,
                appendAddItemLine: false,
                sectionTopics: this.initilizeRotationTopics(section)
            };

            handover.sections.push(convertedSection);

            this.handoverSectionService.createSection(convertedSection);
        });

        handover.sections = handover.sections.sort((a, b) => Number(b.templateSection) - Number(a.templateSection));
        
        this.addOtherTopicForEachSectionTopics(this.handover);

        return handover;
    }

    initilizeRotationTopics(sectionTemplate: Section): RotationTopic[] {

        let rotationTopics: RotationTopic[] = [];
        sectionTemplate.sectionTopics.filter(t => t.enabled).forEach(templateTopic => {

            var convertedTopic = { 
                sectionnId: sectionTemplate.sectionId,
                isPinned: false,
                id: templateTopic.id,
                name: templateTopic.name,
                enabled: templateTopic.enabled,
                index: templateTopic.index,
                editing: templateTopic.editing,
                isExpand: templateTopic.isExpand,
                templateTopic: true,
                checked: false,
                references: this.initilizeRotationReferences(templateTopic)
            };

            rotationTopics.push(convertedTopic);
            this.rotationTopicService.addRotationTopic(convertedTopic);
        });

       return rotationTopics;
    }

    addOtherTopicForEachSectionTopics(handover: Handover): void{

        handover.sections.forEach(section => {
            if(section.sectionTopics.find(t => t.name == "Other") == null){
                section.sectionTopics.push(this.addOtherTopic());
            }
        });
        
    }

    addOtherTopic(): RotationTopic{
        var references: RotationReference[] = [];
        
        var otherTopic = { 
            id: Guid.create(),
            isPinned: false,
            name: "Other",
            enabled: false,
            index: 0,
            editing: false,
            isExpand: false,
            templateTopic: false,
            checked: false,
            references: references
        };

        this.rotationTopicService.addRotationTopic(otherTopic);
        return  otherTopic;
    }

    initilizeRotationReferences(templateTopic: TemplateTopic): RotationReference[]{

        let rotationReferences: RotationReference[] = [];
        templateTopic.references.filter(t => t.enabled).forEach(reference => {

            var convertedReference = { 
                id: Guid.create(),
                rotationTopicId: templateTopic.id,
                name: reference.name,
                enabled: reference.enabled,
                index: reference.index,
                editing: reference.editing,
                templateReference: true,
                templateDescription: reference.description,
                isPinned: false,
                checked: false,
                expand:false
            };

            rotationReferences.push(convertedReference);

            this.rotationReferenceService.addRotationReference(convertedReference);
        });

        return rotationReferences;
    }

    setShareCounter(handover: Handover): Handover {
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

    getLettersIcon(userId: Guid): string {
        this.myTeamService.getTeamUser(userId).pipe(
            expand(user => 
                {
                    return user.ownerName.split(" ").map((n)=>n[0]).join("");
                }
            ));
        return "";
    }

    getNameByUserId(userId: Guid): string {
        this.myTeamService.getTeamUser(userId).pipe(
            expand(user => 
                {
                    return user.ownerName;
                }
            ));
        return "";
    }

    handoverRecipient(): void{
        const dialogRef = this.dialog.open(HandoverRecipientDialogComponent, { 
            data: this.handover
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
               
                if(this.owner.isActiveRotation && this.owner.curentRotationId){
                    this.handover.recipientId = result.recipientId;
                    this.handoverService.updateHandover(result);
                }else{
                    this.templateService.getTemplateById(this.handover.templateId).subscribe(template => {
                        this.template = template;
                        this.handover = this.initilizeTemplateSection(this.template, this.handover);
                    }); 
                    this.owner.isActiveRotation = true;
                    this.owner.curentRotationId = this.handover.handoverId;
                   
                   // this.cdr.detectChanges();
                }
            }
        });
    }

    handoverDates(): void {
        const dialogRef = this.dialog.open(DatesShiftDialogComponent, { 
            data: { 
                endDate: this.handover.endDate,
                endTime: this.handover.endTime
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handover.endDate = result.endDate;
                this.handover.endTime = result.endTime;
               
                if(this.owner.curentRotationId && this.owner.isActiveRotation){
                    this.handoverService.updateHandover(this.handover);
                }
                else{
                    this.handoverRecipient();
                }
            }
        });
    }

    shareReport(): void{
        this.handover.shareUsers = []; //for test
        this.handover.shareUsers.push(this.teamMembers[1]); //for test

        this.teamMembers = this.teamMembers.filter(u=> !this.handover.shareUsers.includes(u));

        let sharReportModel: ShareReportModel = {
            ownerId: this.handover.ownerId,
            handoverId: this.handover.handoverId,
            shareUsers: this.handover.shareUsers,
            shareEmails: this.handover.shareEmails,
            teamMembers: this.teamMembers
        };

        
        const dialogRef = this.dialog.open(ShareReportDialogComponent, { 
            data: sharReportModel
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handoverService.updateHandover(result);
                this.handover.shareUsers = result.sharedUsers;
                this.handover = this.setShareCounter(this.handover);
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

    reportComments(): void{
        const dialogRef = this.dialog.open(ReportCommentsDialogComponent, { 
            data: this.handover
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.handover.reportComments = [];
              this.handover.reportComments.push(result);
              this.handoverService.updateHandover(this.handover);
            }
        });
    }

    startHandover(): void {
        const dialogRef = this.dialog.open(DatesShiftDialogComponent, { 
            data: { 
                endDate: null,
                endTime: null
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let newHandover: Handover = {
                    templateId: this.template.templateId,
                    handoverId: Guid.create(),
                    ownerId: this.owner.userId,
                    sections: [],
                    endTime: result.endTime,
                    endDate:  result.endDate,
                    createDate: new Date().toLocaleDateString(),
                    liveRotation: true
                };

                 this.handoverService.addHandover(newHandover).subscribe(handover => {
                    this.handover = handover
                }); 

                if(this.owner.alwaysShareRecipient){
                    if(this.owner.alwaysShareRecipient.emails){
                        newHandover.shareEmails = this.owner.alwaysShareRecipient.emails;
                    }
                    if(this.owner.alwaysShareRecipient.usersIds){
                        newHandover.shareUsers = [];
                        this.owner.alwaysShareRecipient.usersIds.forEach(userId =>{
                            this.myTeamService.getTeamUser(userId).subscribe(user =>{
                                newHandover.shareUsers.push(user);
                            })
                        }) 
                    }
                }

                this.handover = newHandover; //  for test
                this.loadData();
                this.handover.liveRotation = true; // for test
                this.handoverRecipient();
            }
        });
    }

    reportPreview(handover: Handover): void {

       /*  this.router.navigate(['/pdf-preview'], {
            state: { data: handover }
        }); */
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['/pdf-preview'], { queryParams: { id: handover.handoverId.toString() } })
        );
        
        window.open(url, '_blank');
    } 

    finishRotation(handover: Handover): void{
        const dialogRef = this.dialog.open(FinishRotationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                handover.liveRotation = false;

                this.owner.isActiveRotation = false;
                this.owner.curentRotationId = null;

                this.handoverService.updateHandover(handover);
                this.myTeamService.updateTeamUser(this.owner);

                this.handover = null;
               //sent reports
            }
        });
    }
}
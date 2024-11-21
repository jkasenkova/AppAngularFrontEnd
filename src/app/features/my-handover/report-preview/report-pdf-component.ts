import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
import { Guid } from "guid-typescript";
import { jsPDF } from 'jspdf';
import { Handover } from "src/app/models/handover";
import { pdfReportModel } from "../models/pdfReportModel";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { MyTeamService } from "src/app/services/myTeamService";
import { CommonModule } from "@angular/common";
import { LocationService } from "src/app/services/locationService";
import { HandoverSection } from "src/app/models/handoverSection";
import { TopicModelComponent } from "./topic-model/topic-model.component";
import html2canvas from "html2canvas";
import { ReportCommentsModel } from "src/app/models/reportCommentsModel";
import { ReportCommentsComponent } from "./report-comments/report-comments.component";
import { HandoverService } from "src/app/services/handoverService";
import { ActivatedRoute } from "@angular/router";
import { SectionType } from "src/app/models/sectionType";
import { SortType } from "src/app/models/sortType";
import { DataService } from "src/app/services/data.service";

@Component({
    selector: 'pdf-preview',
    standalone: true,
    imports: [
        CommonModule,
        TopicModelComponent,
        ReportCommentsComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './report-pdf-component.html',
    styleUrls: ['./report-pdf-component.less'],
    encapsulation: ViewEncapsulation.None
})

export class ReportPDFPreviewComponent implements OnInit {
    @ViewChild('pdfReport', {static: false}) pdfReport: ElementRef;
    handover: Handover;
    pdfReportModel: pdfReportModel;
    handoverOwner: MyTeamModel;
    handoverRecipient: MyTeamModel;
    contributors: string[];
    timeZoneReport: string;
    receivedData: any;

    @Output() sectionsOut: HandoverSection[];
    @Output() reportComments: ReportCommentsModel[];
    @Input() handoverOut: Handover; 
    data: any;


  //for test
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};

handoverOwnerTmp: MyTeamModel = {
    ownerName: "Julia Kasenkova",
    ownerEmail: "jkasenkova@gmail.com",
    userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
    ownerRole: "Developer",
    ownerRoleId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
    isActiveRotation: true, //get state from back by curentRotationId
    recipientId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
    locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
    lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
    curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
    selected: false
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

  constructor(
    private myTeamService: MyTeamService,
    private locationService: LocationService,
    private handoverService: HandoverService,
    private route: ActivatedRoute,
    private dataService: DataService) 
    { }

    ngOnInit(): void {
        debugger;
        this.dataService.currentData.subscribe(data => {
            if (data) {
              this.receivedData = data; 
            }
        });

        const id = this.route.snapshot.queryParamMap.get('id');

        this.handoverService.getHandoverById(Guid.parse(id)).subscribe(handover =>{
            this.handover = handover;
        });

        this.handover = this.handoverTmp; // for test

        this.sectionsOut = this.handover.sections;

        this.handoverOwner = this.handoverOwnerTmp; // for test
        this.handoverRecipient = this.handoverRecipientTmp; // for test

        this.myTeamService.getTeamUser(this.handover.ownerId).subscribe(owner => {
            this.handoverOwner = owner;
        });

        this.locationService.getLocationById(this.handoverOwner.locationId).subscribe(location => {
            this.timeZoneReport = location.timeZoneId;
        });

        if(this.handoverOwner.contributors){
            this.handoverOwner.contributors.forEach(userId => {
                this.myTeamService.getTeamUser(userId).subscribe(user=>{
                    this.contributors.push(user.ownerName);
                });
            });
        }

        this.myTeamService.getTeamUser(this.handover.recipientId).subscribe(recipient => {
            this.handoverRecipient = recipient;
        }); 

        this.pdfReportModel = this.initilizeReportData(this.handover);
        this.reportComments = this.handover.reportComments;
    }

    
    exportToPDF(){
        this.convertToPDF();
    }

    private convertToPDF() {
        const content = this.pdfReport.nativeElement;
        var date = new Date().toLocaleDateString();

        html2canvas(content).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            pdf.save('RelayWorks-Report/' + date + '.pdf');
        });
    }

    initilizeReportData(handover: Handover): pdfReportModel{
        
        var shared = handover.shareUsers ? handover.shareUsers.flatMap(u=>u.ownerName)
        .concat(handover.shareEmails).join(", "): handover.shareEmails.join(", ");

        var dataModel: pdfReportModel = {
            handoverId: handover.handoverId,
            handoverDates: handover.createDate + " - " + handover.endDate,
            handoverType: handover.liveRotation ? "Draft Version" : "Final Version",
            handoverTimeZone: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", //this.timeZoneReport,
            handoverOwner: this.handoverOwner.ownerName,
            handoverRecipient: this.handoverRecipient.ownerName,
            handoverSharedReports: shared,
            handoverContributors: this.handoverOwner.contributors ? this.handoverOwner.contributors.join(",") : null
        };

        return dataModel;
    }
}
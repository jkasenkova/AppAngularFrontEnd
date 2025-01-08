import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, OnInit, Output, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { DataService } from "src/app/services/data.service";
import { ShiftState } from "src/app/models/shiftState";

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
    userId: 'e50c8635-4b51-4cdd-85ca-4ae35acb8bbd',
    ownerRoleId: 'db3fd6a0-e14f-43a1-9393-c5332dee29cd',
    recipientId: 'db3fd6a0-e14f-43a1-9393-c5332dee29cd',
    locationId:  '314d09a4-cb44-4c08-99d7-15d3441bc3cb',
    lineManagerId: '314d09a4-cb44-4c08-99d7-15d3441bc3cb',
    currentRotationId: '314d09a4-cb44-4c08-99d7-15d3441bc3cb',
};

handoverRecipientTmp: MyTeamModel = {
    ownerName: "Peter Hlazunov",
    ownerEmail: "phlazunov@gmail.com",
    userId: 'e50c8635-4b51-4cdd-85ca-4ae35acb8bbd',
    ownerRoleId: 'db3fd6a0-e14f-43a1-9393-c5332dee29cd',
    recipientId: 'db3fd6a0-e14f-43a1-9393-c5332dee29cd',
    locationId:  '314d09a4-cb44-4c08-99d7-15d3441bc3cb',
    lineManagerId: '314d09a4-cb44-4c08-99d7-15d3441bc3cb',
    currentRotationId: '314d09a4-cb44-4c08-99d7-15d3441bc3cb',
};


  constructor(
    private myTeamService: MyTeamService,
    private locationService: LocationService,
    private handoverService: HandoverService,
    private route: ActivatedRoute,
    private dataService: DataService) 
    { }

    ngOnInit(): void {
        this.dataService.currentData.subscribe(data => {
            if (data) {
              this.receivedData = data; 
            }
        });

        const id = this.route.snapshot.queryParamMap.get('id');

        this.handoverService.getShiftById(id).subscribe(handover =>{
            this.handover = handover;
        });

        this.sectionsOut = this.handover.sections;

        this.myTeamService.getTeamUser(this.handover.ownerId).subscribe(owner => {
            this.handoverOwner = owner;
        });

        this.locationService.getLocationById(this.handoverOwner.locationId).subscribe(location => {
            this.timeZoneReport = location.timeZone;
        });

        if(this.handoverOwner.contributors){
            this.handoverOwner.contributors.forEach(userId => {
                this.myTeamService.getTeamUser(userId).subscribe(user=>{
                    this.contributors.push(user.ownerName);
                });
            });
        }

        this.myTeamService.getTeamUser(this.handover.shiftRecipientId).subscribe(recipient => {
            this.handoverRecipient = recipient;
        }); 

        this.pdfReportModel = this.initializeReportData(this.handover);
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

    initializeReportData(handover: Handover): pdfReportModel{
        
        var shared = handover.shareUsers ? handover.shareUsers.flatMap(u => u.name)
        .concat(handover.shareEmails).join(", "): handover.shareEmails.join(", ");

        var dataModel: pdfReportModel = {
            handoverId: handover.handoverId,
            handoverDates: handover.startDateTime + " - " + handover.endDateTime,
            handoverType: handover.state == ShiftState.Confirmed ? "Draft Version" : "Final Version",
            handoverTimeZone: "(UTC+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", //this.timeZoneReport,
            handoverOwner: this.handoverOwner.ownerName,
            handoverRecipient: this.handoverRecipient.ownerName,
            handoverSharedReports: shared,
            handoverContributors: this.handoverOwner.contributors ? this.handoverOwner.contributors.join(",") : null
        };

        return dataModel;
    }
}

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
import { Router, RouterModule} from '@angular/router';
import { ReportPDFPreviewComponent } from "./report-preview/report-pdf-component";
import { MatTabsModule } from "@angular/material/tabs";
import { FinishRotationDialogComponent } from "./finish-rotation/finish-rotation.component";
import { RoleModel } from "src/app/models/role";
import { RoleService } from "src/app/services/roleService";
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

    constructor(
        private authFacade: AuthFacade,
        private router: Router,
        private handoverSectionService: HandoverSectionService, 
        private handoverService: HandoverService,
        private myTeamService: MyTeamService,
        private templateService: TemplateService,
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
        private roleService: RoleService) 
        {
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
      
      if(this.owner && this.owner.curentRotationId) {
            this.handoverService.getHandoverById(this.owner.curentRotationId).subscribe(rotation =>
            {
                this.handover = rotation;
                this.handoverOut = rotation

                this.handover = this.setShareCounter(this.handover);
              
            });
      }

      if(this.ownerRole){
        this.templateService.getTemplateById(this.ownerRole.templateId).subscribe(template =>{
            this.template = template;
            this.handover = this.initilizeTemplateSection(this.template, this.handover);
        });
      }

        this.myTeamService.getTeamUsers().subscribe(teams => {
            this.teamMembers = teams;
        }); 
    }

    initilizeTemplateSection(template: Template, handover: Handover):Handover {

        template.sections.forEach(section => {

            var convertedSection: HandoverSection = { 
                sectionId: section.id,
                sectionName: section.name,
                handoverId: handover.handoverId,
                iHandoverSection: false,
                sectionType: section.type,
                sortType: section.sortTopicType,
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
                sectionnId: sectionTemplate.id,
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
        templateTopic.templateReferences.filter(t => t.enabled).forEach(reference => {

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
                    templateId: this.template.id,
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
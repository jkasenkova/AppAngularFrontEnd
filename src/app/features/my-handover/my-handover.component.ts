import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, ViewEncapsulation, Output, ChangeDetectorRef} from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Handover } from "src/app/models/handover";
import { RotationTopic } from "src/app/models/rotationTopic";
import { MatTooltipModule } from '@angular/material/tooltip';
import { HandoverSection } from "src/app/models/handoverSection";
import { RotationReference } from "src/app/models/rotationReference";
import { HandoverSectionService } from "src/app/services/handoverSectionService";
import { HandoverRecipientDialogComponent } from "./dialogs/recipient/handover-recipient.component";
import { DateShiftDialogComponent } from "./dialogs/dates/date-shift.component";
import { ShareReportDialogComponent } from "./dialogs/share-report/share-report.component";
import { CommonModule, DatePipe, formatDate  } from '@angular/common';
import { ReportCommentsDialogComponent } from "./dialogs/report-comments/report-comments.component";
import { ShareReportModel } from "./models/shareReportModel";
import { Template } from "src/app/models/template";
import { TemplateTopic } from "src/app/models/templateTopic";
import { Section } from "src/app/models/section";
import { RotationTopicService } from "src/app/services/rotationTopicService";
import { RotationReferenceService } from "src/app/services/rotationReferenceService";
import { MatExpansionModule } from '@angular/material/expansion';
import { ViewUserPanelComponent } from "./view-user-panel/view-user-panel.component";
import { TopicComponent } from "./topic/topic.component";
import { expand, map } from "rxjs";
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { MatTabsModule } from "@angular/material/tabs";
import { FinishRotationDialogComponent } from "./finish-rotation/finish-rotation.component";
import { RoleModel } from "src/app/models/role";
import { AuthFacade } from "src/app/services/auth/store/auth.facade";
import { RoleService } from "src/app/services/roleService";
import { HandoverService } from "src/app/services/handoverService";
import { UserService } from "src/app/services/userService";
import { UserModel } from "@models/user";
import { ShiftState } from "@models/shiftState";

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
    MatTabsModule
],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-handover.component.html',
    styleUrls: ['./my-handover.component.less'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe] 
})

export class MyHandoverComponent implements OnInit {
    teamMembers: UserModel[] = [];
    template: Template;
    ownerRole: RoleModel;
    expandAll: boolean = false;
    countShare: number;
    viewPanel: boolean = false;
    owner: UserModel;

    readonly dialog = inject(MatDialog);
    @Output() viewerId: string;
    @Output() handover: Handover;
    @Input() handoverAdmin: boolean; 

    constructor(
        private authFacade: AuthFacade,
        private router: Router,
        private handoverSectionService: HandoverSectionService, 
        private handoverService: HandoverService,
        private userService: UserService,
        private roleService: RoleService,
        private rotationTopicService: RotationTopicService,
        private rotationReferenceService: RotationReferenceService,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {

        this.viewerId = this.route.snapshot.paramMap.get('id'); 
        this.authFacade.state.subscribe(data => 
        {
            if(this.viewerId != null && this.viewerId !== data.authUser.id){
                this.viewPanel = true;
            }
            this.roleService.getRoleById(data.authUser.role.RoleId)
            .pipe(
                map(role => role.teamId)
            )
            .subscribe(teamId => {
                this.userService.getUser(data.authUser.id).subscribe(owner =>{
                    owner.teamId = teamId;
                    this.owner = owner;
                    this.loadData();
                })
            });
        }); 
    }

    loadData(): void {
      if(this.owner && this.owner.currentRotationId) 
       {
            this.handoverService.getShiftById(this.owner.currentRotationId).subscribe(rotation =>
            {
                rotation.endDateTime = this.datePipe.transform(rotation.endDateTime, 'yyyy-MM-dd HH:mm');
                this.handover = rotation;
                this.handover = this.setShareCounter(this.handover);
            });
       }
    }

    initializeTemplateSection(template: Template, handover: Handover): Handover {

        template.sections.forEach(section => {

            var convertedSection: HandoverSection = { 
                sectionId: section.id,
                sectionName: section.name,
                handoverId: handover.id,
                iHandoverSection: false,
                sectionType: section.type,
                sortType: section.sortTopicType,
                addBtnShow: true,
                sortReferenceType: section.sortReferenceType,
                templateSection: true,
                appendAddItemLine: false,
                sectionTopics: this.initializeRotationTopics(section)
            };

            handover.sections.push(convertedSection);

            this.handoverSectionService.createSection(convertedSection);
        });

        //section sort

        this.addOtherTopicForEachSectionTopics(this.handover);

        return handover;
    }

    initializeRotationTopics(sectionTemplate: Section): RotationTopic[] {

        let rotationTopics: RotationTopic[] = [];
        sectionTemplate.sectionTopics.filter(t => t.enabled).forEach(templateTopic => {

            var convertedTopic = { 
                sectionId: sectionTemplate.id,
                isPinned: false,
                id: templateTopic.id,
                name: templateTopic.name,
                enabled: templateTopic.enabled,
                index: templateTopic.index,
                editing: templateTopic.editing,
                isExpand: templateTopic.isExpand,
                templateTopic: true,
                checked: false,
                references: this.initializeRotationReferences(templateTopic)
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
            id: '',//Guid.create(),
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

    initializeRotationReferences(templateTopic: TemplateTopic): RotationReference[]{

        let rotationReferences: RotationReference[] = [];
        templateTopic.templateReferences.filter(t => t.enabled).forEach(reference => {

            var convertedReference = { 
                id: '',
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

    getLettersIcon(userId: string): string {

        this.userService.getUser(userId).subscribe(user => {
            debugger;
            var getLetters = [user.firstName[0] + user.lastName[0]].join("");
            return getLetters;
        });

        /* this.userService.getUser(userId).pipe(
            expand(user => 
                {
                    return user.firstName + user.lastName.split(" ").map((n)=>n[0]).join("");
                }
            )); */
        return "";
    }

    getNameByUserId(userId: string): string {
        this.userService.getUser(userId).pipe(
            expand(user => 
                {
                    return user.firstName;
                }
            ));
        return "";
    }

    handoverRecipient(templateId?: string, endDateTime?: string): void {
        const dialogRef = this.dialog.open(HandoverRecipientDialogComponent, 
        {
            data: { 
                templateId: templateId,
                endDateTime: endDateTime
            },
        });

        dialogRef.afterClosed().subscribe(result => 
        {
            if (result) 
            {
                if(this.owner.currentRotationId && this.handover != null)
                {
                    this.handover.shiftRecipientId = result.recipientId;
                    this.handoverService.updateShift(result).subscribe();
                }
                else
                {
                   /*  this.templateService.getTemplateById(this.handover.templateId).subscribe(template => {
                        this.template = template;
                        this.handover = this.initializeTemplateSection(this.template, this.handover);
                    }); 
                    this.owner.currentRotationId = this.handover.handoverId; */

                    this.handover = this.createShift(result.templateId, result.endDateTime, result.recipientId, this.owner.id);
                } 
            }
        });
    }

    handoverDates(): void {
        const dialogRef = this.dialog.open(DateShiftDialogComponent, { 
            data: { 
                endDate: this.handover.endDateTime,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handover.endDateTime = result.endDateTime;
                
                if(this.owner.currentRotationId){
                    this.handoverService.updateShift(this.handover);
                }
                else{
                    this.handoverRecipient();
                }
            }
        });
    }

    shareReport(): void{
        this.teamMembers = this.teamMembers.filter(u=> !this.handover.shareUsers.includes(u));

        let shareReportModel: ShareReportModel = {
            ownerId: this.handover.ownerId,
            handoverId: this.handover.id,
            shareUsers: this.handover.shareUsers,
            shareEmails: this.handover.shareEmails
        };

        
        const dialogRef = this.dialog.open(ShareReportDialogComponent, { 
            data: shareReportModel
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.handoverService.updateShift(result);
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
            arr = arr.concat(this.handover.shareUsers.flatMap(u => u.firstName + u.lastName));
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
              this.handoverService.updateShift(this.handover);
            }
        });
    }

    startShift(): void {
        const dialogRef = this.dialog.open(DateShiftDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) 
            {
                this.roleService.getRoleById(this.owner.roleId).subscribe(role => 
                {
                    
                    var templateId = role.templateId ? role.templateId : "d18e8b72-1756-4cc4-bbed-855153269071";
                    const dateTime = this.formattedDateTime(result.endDate, result.endTime);
                    this.handoverRecipient(templateId, dateTime);
                });  
            }
        });
    }

    formattedDateTime(date: string, time: string): string {
        const [day, month, year] = date.split(".").map(Number);
        const [timePart, meridian] = time.split(" ");
        const [rawHours, minutes] = timePart.split(":").map(Number);
        let hours = rawHours;
    
        if (meridian === "PM" && hours < 12) {
          hours += 12;
        } else if (meridian === "AM" && hours === 12) {
          hours = 0;
        }
        const dateObject = new Date(year, month - 1, day, hours, minutes);
        return formatDate(dateObject, 'yyyy-MM-dd HH:mm:ss', 'en-US');
    }

    createShift(templateId: string, endDateTime: string, recipientId: string, ownerId: any): Handover {
        var shift: Handover = {
            templateId: templateId,
            ownerId: ownerId,
            shiftRecipientId: recipientId,
            endDateTime: endDateTime,
            state: 1
        };

        this.handoverService.addShift(shift).subscribe(shift => {
            this.owner.currentRotationId = shift.id;
            this.userService.updateUser(this.owner).subscribe();
            this.cdr.detectChanges(); 
        });
        return this.handover = shift;
    }

    reportPreview(handover: Handover): void {

       /*  this.router.navigate(['/pdf-preview'], {
            state: { data: handover }
        }); */
        const url = this.router.serializeUrl(
            this.router.createUrlTree(['/pdf-preview'], { queryParams: { id: handover.id.toString() } })
        );
        
        window.open(url, '_blank');
    } 

    finishShift(handover: Handover): void{
        const dialogRef = this.dialog.open(FinishRotationDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.owner.currentRotationId = null;
                handover.state = ShiftState.Finished;
                this.handoverService.updateShift(handover).subscribe();
                this.userService.updateUser(this.owner).subscribe();

                this.handover = null;
                this.cdr.detectChanges();
               //sent reports
            }
        });
    }
}
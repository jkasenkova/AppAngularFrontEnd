import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from '@angular/material/tooltip';
import { RotationSection } from "src/app/models/handoverSection";
import { RotationReference } from "src/app/models/rotationReference";
import { HandoverRecipientDialogComponent } from "./dialogs/recipient/handover-recipient.component";
import { ReportCommentsDialogComponent } from "./dialogs/report-comments/report-comments.component";
import { ShareReportDialogComponent } from "./dialogs/share-report/share-report.component";
import { FinishRotationDialogComponent } from "./finish-rotation/finish-rotation.component";
import { ShareReportModel } from "./models/shareReportModel";
import { TopicComponent } from "./topic/topic.component";
import { ViewUserPanelComponent } from "./view-user-panel/view-user-panel.component";
import { TopicComponent } from "./topic/topic.component";
import { expand, filter, forkJoin, map, Observable, switchMap, tap } from "rxjs";
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
import { TemplateService } from "@services/templateService";
import { TemplateTopicService } from "@services/templateTopicService";
import { RotationSectionService } from "@services/rotationSectionService";
import { Reference } from "@models/reference";
import { TemplateReferenceService } from "@services/templateReferenceService";
import { SectionService } from "@services/sectionService";

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
    recipient: UserModel;
    countShare: number;
    owner: UserModel;
    userInitials: string = '';
    readonly dialog = inject(MatDialog);

    @Output() viewerId: string;
    @Output() handover: Handover;
    @Output() expandAll: boolean = false;
    @Output() sections: RotationSection[] = [];

    constructor(
        private authFacade: AuthFacade,
        private router: Router,
        private templateService: TemplateService,
        private templateTopicService: TemplateTopicService,
        private handoverSectionService: RotationSectionService, 
        private templateReferenceService: TemplateReferenceService,
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
        this.authFacade.state
        .pipe(
          switchMap((data) => {
            const userId = this.viewerId != null && this.viewerId !== data.authUser.id
              ? this.viewerId
              : data.authUser.id;
  
            if (!userId) {
              console.error('viewerId condition not met or userId is null');
              return [];
            }
  
            return this.userService.getUserById(userId);
          }),
          tap((user: UserModel) => {
            this.owner = user;
          }),
          filter((user: UserModel) => !!user.currentRotationId),
          tap((user: UserModel) => this.initializeRotation(user.currentRotationId))
        )
        .subscribe({
          error: (err) => console.error('Error processing auth or user:', err)
        });
    }


    initializeRotation(rotationId: string): void {
        this.handoverService
          .getShiftById(rotationId)
            .subscribe((handover: Handover) => {
                this.handover = this.setShareCounter(handover);
                this.handover.endDateTime = this.datePipe.transform(handover.endDateTime, 'yyyy-MM-dd HH:mm');
                this.getUser(handover.shiftRecipientId);
                this.handover = handover;
                this.cdr.detectChanges();
            });
    }

    getTemplateSectionsAndTransform(templateId: string, rotationId: string): Observable<RotationSection[]> {
        return new Observable<RotationSection[]>((observer) => {
            this.templateService.getTemplateById(templateId).subscribe({
                next: (template: Template) => {
                  const sectionRequests = template.sections.map((templateSection) =>
                    this.transformAndSaveSection(templateSection, rotationId)
                  );
                  forkJoin(sectionRequests).subscribe({
                    next: (rotationSections: RotationSection[]) => {

                    setTimeout(() => {
                        observer.next(rotationSections);
                        observer.complete();
                    }, 500);
                    },
                    error: (err) => {
                      observer.error(err);
                    },
                  });
                },
                error: (err) => {
                  observer.error(err);
                },
            });
        });
    }
    
    private transformAndSaveSection(templateSection: Section, rotationId: string): Observable<RotationSection> {
        const rotationSection: RotationSection = this.convertToRotationSection(templateSection, rotationId);
    
        return new Observable<RotationSection>((observer) => {
            this.handoverSectionService.createSection(rotationSection).subscribe({
            next: (savedSection) => {
              this.templateTopicService.getTemplateTopicsBySectionId(templateSection.id).subscribe({
                next: (templateTopics: TemplateTopic[]) => {
                  const topicRequests = templateTopics.map((templateTopic) => 
                    this.transformAndSaveTopic(templateTopic, savedSection.id)
                  );
                  forkJoin(topicRequests).subscribe({
                    next: (topics: RotationTopic[]) => {
                      savedSection.topics = topics;
                      observer.next(savedSection);
                      observer.complete();
                    },
                    error: (err) => {
                      console.error('Error saving topics:', err);
                      observer.error(err);
                    },
                  });
                },
                error: (err) => {
                  console.error('Error fetching template topics:', err);
                  observer.error(err);
                },
              });
            },
            error: (err) => {
              console.error('Error saving rotation section:', err);
              observer.error(err);
            },
          });
        });
    }
    
    private transformAndSaveTopic(templateTopic: TemplateTopic, rotationSectionId: string): Observable<RotationTopic> {
        const rotationTopic: RotationTopic = this.transformToRotationTopic(templateTopic, rotationSectionId);

       return new Observable<RotationTopic>((observer) => {
        this.rotationTopicService.addRotationTopic(rotationTopic).subscribe({
          next: (savedTopic) => {
            this.templateReferenceService.geTemplateReferences(templateTopic.id).subscribe({
              next: (templateReferences: Reference[]) => {
                const referenceRequests = templateReferences.map((templateReference) =>
                  this.transformAndSaveReference(templateReference, savedTopic.id)
                );
                forkJoin(referenceRequests).subscribe({
                  next: (references: RotationReference[]) => {
                    savedTopic.rotationReferences.push(...references);
                    observer.next(savedTopic);
                    observer.complete();
                  },
                  error: (err) => {
                    console.error('Error saving references:', err);
                    observer.error(err);
                  },
                });
              },
              error: (err) => {
                console.error('Error fetching template references:', err);
                observer.error(err);
              },
            });
          },
          error: (err) => {
            console.error('Error saving rotation topic:', err);
            observer.error(err);
          },
        });
      });
    }

    private transformAndSaveReference(templateReference: Reference, rotationTopicId: string): Observable<RotationReference> {
        const rotationReference: RotationReference = this.convertToRotationReference(templateReference, rotationTopicId);
        return this.rotationReferenceService.addRotationReference(rotationReference);
    }

    private convertToRotationSection(templateSection: Section, handoverId: string): RotationSection {
        return {
            name: templateSection.name,
            rotationId: handoverId,
            type: templateSection.type,
            sortTopicType: templateSection.sortTopicType,
            addBtnShow: true,
            templateSection: true,
            sortReferenceType: templateSection.sortReferenceType,
            topics: []
        };
    }

    private convertToRotationReference(templateReference: Reference, rotationTopicId: string): RotationReference {
        return {
            name: templateReference.name,
            rotationTopicId: rotationTopicId,
            enabled: true,
            index: 0,
            templateReference: false,
            templateDescription: templateReference.description,
            isPinned: false,
            whitePin: true,
            checked: false,
            editing: false,
            expand: false
        };
    }

    private transformToRotationTopic(templateTopic: TemplateTopic, sectionId: string): RotationTopic {
        return {
            sectionId: sectionId,
            isPinned: false,
            id: templateTopic.id,
            name: templateTopic.name,
            enabled: true,
            index: templateTopic.index,
            editing: templateTopic.editing,
            isExpand: templateTopic.isExpand,
            whitePin: true,
            checked: false,
        };
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
    }

    getOwnerInitials(): string {
        const firstNameInitial = this.owner.firstName ? this.owner.firstName[0].toUpperCase() : '';
        const lastNameInitial = this.owner.lastName ? this.owner.lastName[0].toUpperCase() : '';
        return `${firstNameInitial}${lastNameInitial}`;
    }

    getUser(userId: string): void {
        this.userService.getUserById(userId).subscribe({
          next: (user: UserModel) => {
            this.recipient = user;
            this.userInitials = this.getInitials(user.firstName, user.lastName);
          },
          error: (err) => {
            console.error('Error fetching user:', err);
          },
        });
    }
    
    getInitials(firstName: string, lastName: string): string {
        const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
        const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
        return `${firstInitial}${lastInitial}`;
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
                this.getUser(result.recipientId);
                if(this.owner.currentRotationId && this.handover != null)
                {
                    this.handover.shiftRecipientId = result.recipientId;
                    this.handoverService.updateShift(result).subscribe();
                }
                else
                {
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

    createShift(templateId: string, endDateTime: string, recipientId: string, ownerId: string): Handover {
        var shift: Handover = {
            templateId: templateId,
            ownerId: ownerId,
            shiftRecipientId: recipientId,
            endDateTime: endDateTime,
            state: 1,
            sections: []
        };


        this.handoverService.addShift(shift).subscribe(shift => {
            this.owner.currentRotationId = shift.id;
            shift.endDateTime = this.datePipe.transform(shift.endDateTime, 'yyyy-MM-dd HH:mm');
            this.handover = shift;
            this.cdr.detectChanges(); 
            this.getTemplateSectionsAndTransform(templateId, shift.id).subscribe({
                next: (sections: RotationSection[]) => {
                  this.sections = [...sections];
                  this.cdr.detectChanges();
                },
                error: (err) => {
                    console.error('Error fetching user:', err);
                  },
              });

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
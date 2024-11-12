import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MyTeamModel } from "src/app/models/myTeamModel";
import { Guid } from "guid-typescript";
import { ReportCommentsModel } from "src/app/models/reportCommentsModel";
import { CommentsService } from "src/app/services/commentsService";
import { UserModel } from "src/app/models/user";
import { Handover } from "src/app/models/handover";
import moment from "moment";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
    selector: 'report-comments',
    templateUrl: './report-comments.component.html',
    styleUrl: './report-comments.component.less',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        ReactiveFormsModule,
        MatIconModule,
        MatDialogModule,
        MatTooltipModule
    ]
})

export class ReportCommentsDialogComponent implements OnInit {
    commentsForm: FormGroup;
    expandLines: boolean = false;
    addBtnVisible: boolean = true;
    authorizedUser: UserModel;
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    currentTime = moment().tz(this.timezone).format('YYYY-MM-DD HH:mm');

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

    authorizedUserTmp: UserModel = {
        userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        userName: "John Smith",
        userSurname: "Smith",
        email: "john@gmail.com",
        password: "johnDoe123!",
        roleId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        teamId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        companyId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
    };

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ReportCommentsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover,
        private commentsService: CommentsService
    ) {
        this.commentsForm = this.fb.group({
            commentId: null,
            handoverId: data.handoverId,
            ownerId: null,
            createDate: null,
            comment: null,
            reportComments: [data.reportComments]
        });

    }

    ngOnInit(): void {
        //get from system authorized User
        //for test
        this.authorizedUser = this.authorizedUserTmp;
    }

    expandCommentLines(){
        this.addBtnVisible = false;
        this.expandLines = true;
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (!this.commentsForm.errors) {
            this.dialogRef.close(this.commentsForm.value);
        }
    }

    uploadComment(){
        this.expandLines = false;
        this.addBtnVisible = true;
        if(this.commentsForm.get('commentId').value){

            var reportComment = this.commentsForm.value as ReportCommentsModel;

            let indexToUpdate = this.data.reportComments.findIndex(item => item.commentId === reportComment.commentId);
            this.data.reportComments[indexToUpdate] = reportComment;
            this.data.reportComments = Object.assign([], this.data.reportComments);
            reportComment.createDate = this.currentTime;
            this.commentsService.updateComment(reportComment); 

            this.commentsForm.get('commentId').reset();
            this.commentsForm.get('comment').reset();
        }
        else{
            const comment = Object.assign( new ReportCommentsModel(), {
                owner: this.teamUserTmp,
                comment: this.commentsForm.get('comment').value,
                handoverId: this.data.handoverId,
                createDate: this.currentTime,
                commentId: Guid.create()
            });

            this.commentsForm.controls['commentId'].setValue(comment.commentId);

            this.data.reportComments.push(comment);
            this.commentsService.addComment(comment);

            this.commentsForm.get('reportComments').setValue(this.data.reportComments);

            this.commentsForm.get('commentId').reset();
            this.commentsForm.get('comment').reset();
        }
    }

    getNameUser(): string {
        if(this.authorizedUser){
            return this.authorizedUser.userName;
        }
        return "";
    }


    getLettersIcon(): string {
        if(this.authorizedUser){
            var getLetters = (this.authorizedUser.userName[0] + this.authorizedUser.userSurname[0])
            .split(" ")
            .join("");

            return getLetters;
        }
        return "";
    }



    editComment(reportComment: ReportCommentsModel){
        this.addBtnVisible = false;
        this.expandLines = true;

        this.commentsForm.setValue({
            comment: reportComment.comment,
            handoverId: reportComment.handoverId,
            commentId: reportComment.commentId,
            ownerId: this.authorizedUser.userId,
            createDate: reportComment.createDate,
            reportComments: this.data.reportComments,
         });
    }

    deleteComment(reportComment: ReportCommentsModel){
        this.data.reportComments = this.data.reportComments.filter(r => 
            r.commentId.toString() !== reportComment.commentId.toString());

        this.commentsForm.controls['reportComments'].setValue(this.data.reportComments);

        this.commentsService.deleteCommentById(reportComment.commentId);
    }

}
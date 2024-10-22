import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { Handover } from "src/app/models/handover";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { Guid } from "guid-typescript";
import { ReportCommentsModel } from "src/app/models/reportCommentsModel";
import { CommentsService } from "src/app/services/commentsService";

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
        MatDialogModule
    ]
})

export class ReportCommentsDialogComponent implements OnInit {
    commentsForm: FormGroup;
    expandLines: boolean = false;
    addBtnVisible: boolean = true;

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

    commentsTmp: ReportCommentsModel[] = [
        {
            commentId: Guid.parse("df668eef-9275-4194-bb45-4c5e282a4d34"),
            owner: this.teamUserTmp,
            comment: "Comment 1",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
        {
            commentId: Guid.parse("bda98ec1-1e0f-45f9-be50-e01563232685"),
            owner: this.teamUserTmp,
            comment: "Comment 2",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
        {
            commentId: Guid.parse("68c1c31c-0a1a-4bbf-922a-9f5096b8ae98"),
            owner: this.teamUserTmp,
            comment: "Comment 3",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
        {
            commentId: Guid.parse("951afc76-e33b-481e-a2d9-923c70ac388c"),
            owner: this.teamUserTmp,
            comment: "Comment 4",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
        {
            commentId: Guid.parse("83fdf091-031e-40ed-866b-18aebcbdb733"),
            owner: this.teamUserTmp,
            comment: "Comment 5",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
        {
            commentId: Guid.parse("e8465f20-0866-4753-b3bd-12219a185726"),
            owner: this.teamUserTmp,
            comment: "Comment 6",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        }
    ]

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ReportCommentsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover,
        private commentsService: CommentsService
    ) {
        data.reportComments = this.commentsTmp;
        
        this.commentsForm = this.fb.group({
            commentId: '',
            handoverId: [data.handoverId],
            owner: this.teamUserTmp, // authorized user
            createDate: new Date().toLocaleDateString(),
            comment: '',
            reportComments: [data.reportComments]
        });

    }

    ngOnInit(): void {
     
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

        var value =  this.commentsForm.get('comment').value;

        if(this.commentsForm.get('commentId').value){

            var reportComment = this.commentsForm.value as ReportCommentsModel;

            let indexToUpdate = this.data.reportComments.findIndex(item => item.commentId === reportComment.commentId);
            this.data.reportComments[indexToUpdate] = reportComment;
            this.data.reportComments = Object.assign([], this.data.reportComments);
    
            this.commentsService.updateComment(reportComment); 
        }
        else{
          
            const comment = Object.assign( new ReportCommentsModel(), {
                owner: this.teamUserTmp,
                comment: value,
                handoverId: this.data.handoverId,
                createDate: new Date().toLocaleDateString()
            });

            this.data.reportComments.push(comment);
            this.commentsService.addComment(comment);
        }
    }


    getLettersIcon(ownerName: string): string {
        var getLetters = ownerName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
    }

    editComment(reportComment: ReportCommentsModel){
        this.addBtnVisible = false;
        this.expandLines = true;

        this.commentsForm.setValue({
            comment: reportComment.comment,
            handoverId: reportComment.handoverId,
            commentId: reportComment.commentId,
            owner: reportComment.owner,
            createDate: reportComment.createDate,
            reportComments: this.data.reportComments
         });

    }

    deleteComment(reportComment: ReportCommentsModel){
        this.commentsService.deleteCommentById(reportComment.commentId);

        let indexToUpdate = this.data.reportComments.findIndex(item => item.commentId === reportComment.commentId);
        this.data.reportComments.splice(indexToUpdate, 1);
    }

}
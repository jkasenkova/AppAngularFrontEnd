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
            owner: this.teamUserTmp,
            comment: "Comment 1",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
        {
            owner: this.teamUserTmp,
            comment: "2222222222222222222222222222222222222222",
            handoverId: this.data.handoverId,
            createDate: new Date().toLocaleDateString()
        },
    ]


    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ReportCommentsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover
    ) {
        data.reportComments = this.commentsTmp;
        
        this.commentsForm = this.fb.group({
            handoverId: [data.handoverId],
            owner: this.teamUserTmp, // authorized user
            createDate: Date().toString(),
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

        const comment = Object.assign( new ReportCommentsModel(), {
            owner: this.teamUserTmp,
            comment: value,
            handoverId: this.data.handoverId,
            createDate: new Date().toString()
        });
        this.commentsForm.get('reportComments').setValue([comment]);
        ///save oт server ???
    }

    getLettersIcon(ownerName: string): string {
        var getLetters = ownerName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
    }

}
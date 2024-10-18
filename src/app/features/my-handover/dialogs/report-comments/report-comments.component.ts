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

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ReportCommentsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover
    ) {
        
        this.commentsForm = this.fb.group({
            handoverId: [data.handoverId],
            comment: [],
            owner: this.teamUserTmp, // as log in 
            createDate: Date().toString()
        });
    }

    ngOnInit(): void {
     
    }

    addComment(comment: string){
        this.commentsForm.get('comment').setValue(comment);
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        debugger;
        if (!this.commentsForm.errors) {
            this.dialogRef.close(this.commentsForm.value);
        }
    }
}
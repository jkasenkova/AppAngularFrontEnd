import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { Handover } from "src/app/models/handover";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { MyTeamService } from "src/app/services/myTeamService";
import { Guid } from "guid-typescript";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'handover-recepient',
    templateUrl: './handover-recepient.component.html',
    styleUrl: './handover-recepient.component.less',
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
        MatGridListModule,
        CommonModule      
    ],
})

export class HandoverRecipientDialogComponent implements OnInit {
    recipientForm: FormGroup;
    teamMembers: MyTeamModel[] = [];
    selected: boolean = false;


    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            ownerRoleId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
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
            ownerRoleId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            ownerRole: "Team Lead",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
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
            ownerRoleId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        }
    ]

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<HandoverRecipientDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover,
        private myTeamService: MyTeamService
    ) {
        this.teamMembers = this.teamRotationsTmp;  //for test

        this.recipientForm = this.fb.group({
            handoverId: data ? data.handoverId : null,
            recipientId: [data ? data.recipientId : null, Validators.required]
        });

        if(data && data.recipientId){
            this.teamMembers.map((member, i) => {
                if (member.userId.toString() == data.recipientId.toString()){
                   this.teamMembers[i].selected = true;
                 }
               });
        }
    }

    ngOnInit(): void {
    }


    onNoClick(): void {
        this.dialogRef.close();

        this.myTeamService.getTeamUsers().subscribe(teams =>{
            this.teamMembers = teams
        });
    }

    onSave(): void {
        if (this.recipientForm.valid) {
            this.dialogRef.close(this.recipientForm.value);
        }
    }

    getLettersIcon(ownerName: string): string {
        var getLetters = ownerName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
    }

    selectMember(teamMember: MyTeamModel) {
        teamMember.selected = true;

        this.recipientForm.get('recipientId').setValue(teamMember.userId);

        this.teamMembers.forEach(member =>{
            if(teamMember.userId != member.userId){
            member.selected = false;
            }
        });
    }
}
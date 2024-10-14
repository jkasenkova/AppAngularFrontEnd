import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { Swiper } from "swiper";


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
        MatGridListModule
    ],
})
export class HandoverRecipientDialogComponent implements AfterViewInit {
    recipientForm: FormGroup;
    teamMembers: MyTeamModel[] = [];
    
    @ViewChild('swiperRef')
    swiperRef: ElementRef | undefined;

    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            ownerRole: "Developer",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            ownerRole: "Team Lead",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            ownerRole: "Product Manager",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        }
    ]

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<HandoverRecipientDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover,
        private myTeamService: MyTeamService

    ) {
        this.teamMembers = this.teamRotationsTmp;
        this.recipientForm = this.fb.group({
            handoverId: [data.handoverId],
            recipientId: [data.recipientId, Validators.required]
        });
    }


    ngAfterViewInit(): void {
        var swiper = new Swiper('.swiper-container', {
            direction: 'vertical',
            height: 40,
            slidesPerView: 3,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }
        });
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
}
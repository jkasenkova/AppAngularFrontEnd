import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { LocationModel } from "../../admin-panel/user-orientation/model/locationModel";
import { Guid } from "guid-typescript";
import { RotationType } from "../../admin-panel/user-orientation/model/rotationType";

@Component({
    selector: 'handover-info',
    templateUrl: './handover-info.component.html',
    styleUrl: '../../../styles/pop-up.less',
    standalone: true,
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
        MatSelectModule,
        MatDialogModule,
    ],
})

export class HandoverInfoComponent implements OnInit {
    handoverInfoForm: FormGroup;
    users: MyTeamModel[];

//data for test
    locationListTemp: LocationModel[] = [
        {
            id: Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4"),
            name: "Ukraine",
            timeZoneId: "0aaceca4-4036-4e08-a30d-72a36da93db0"
        },
        {
            id: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            name: "London",
            timeZoneId: "e27aa77e-09ab-48e1-a3fa-59dbe94f5d7c"
        },
    ];

    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            ownerRole: "Developer",
            userId: Guid.parse("fd12a119-8ca5-4bc3-98b2-127dbcad94b1"),
            isActiveRotation : true,
            recipientId: Guid.parse("d121ded4-8f1a-4f3c-aea5-cffc6c6985c7"),
            locationid: Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4"),
            lineManagerId: Guid.parse("825ece43-c3f2-4446-886b-0ed2061bed45")
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            ownerRole: "Team Lead",
            userId: Guid.parse("825ece43-c3f2-4446-886b-0ed2061bed45"),
            isActiveRotation : true,
            recipientId: Guid.parse("d121ded4-8f1a-4f3c-aea5-cffc6c6985c7"),
            locationid: Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4"),
            lineManagerId: Guid.parse("fd12a119-8ca5-4bc3-98b2-127dbcad94b1")
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            ownerRole: "Product Manager",
            userId: Guid.parse("d121ded4-8f1a-4f3c-aea5-cffc6c6985c7"),
            isActiveRotation : false,
            recipientId: Guid.parse("91e8a26c-abd1-4cc0-b594-5ca725834379"),
            locationid: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            lineManagerId: Guid.parse("91e8a26c-abd1-4cc0-b594-5ca725834379")
        },
        {
            ownerName: "Kevin Burt",
            ownerEmail: "kevin_burt@gmail.com",
            ownerRole: "Company Director",
            userId: Guid.parse("91e8a26c-abd1-4cc0-b594-5ca725834379"),
            isActiveRotation : false,
            recipientId: Guid.parse("91e8a26c-abd1-4cc0-b594-5ca725834379"),
            locationid: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            lineManagerId: Guid.parse("d121ded4-8f1a-4f3c-aea5-cffc6c6985c7")
        },
    ];



    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<HandoverInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: MyTeamModel
    ) {
        var location = this.locationListTemp.find(t => t.id.toString() == data.locationid.toString());
        this.users = this.teamRotationsTmp;

        this.handoverInfoForm = this.fb.group({
            handoverOwner: data.ownerName,
            role: data.ownerRole,
            location: location.name,
            lineMananer: this.users.find(u=> u.userId.toString() == data.lineManagerId.toString()).userId,
            recipient: this.users.find(u=> u.userId.toString() == data.recipientId.toString()).userId,
            rotationType:  data.curentRotationId != null ? RotationType.Shift : RotationType.NoRotation,
            contributors: data.contributors
        });
    }

    ngOnInit(){
       
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.handoverInfoForm.valid) {
            this.dialogRef.close(this.handoverInfoForm.value);
        }
    }

    onSelectLineManager(event: any){

    }

    onSelectHandoverRecipient(event: any){
        //send data to server for update;
    }

    onSelectRotationType(event: any){

    }

    onSelectContributors(event: any){

    }
}
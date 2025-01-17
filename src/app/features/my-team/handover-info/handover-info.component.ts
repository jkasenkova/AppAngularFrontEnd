import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { RotationType } from "src/app/models/rotationType";
import { MyTeamService } from "src/app/services/myTeamService";
import { LocationService } from "src/app/services/locationService";
import { AsyncPipe } from '@angular/common';
import {Observable } from 'rxjs';

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
        AsyncPipe
    ],
})

export class HandoverInfoComponent implements OnInit {
    handoverInfoForm: FormGroup;
    users$: Observable<MyTeamModel[]>;
    locationName: string;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<HandoverInfoComponent>,
        private myTeamService: MyTeamService,
        private locationService: LocationService,
        @Inject(MAT_DIALOG_DATA) public data: MyTeamModel
    ) {
       
        this.handoverInfoForm = this.fb.group({
            handoverOwner: data.ownerName,
            role: [], //data.ownerRole,
            location: this.locationName,
            lineManager: data.lineManagerId,
            recipient: data.recipientId,
            rotationType:  data.currentRotationId != null ? RotationType.Shift : RotationType.NoRotation,
            contributors: data.contributors
        });

        this.handoverInfoForm.get('contributors').setValue(data.contributors);
    }

    ngOnInit(): void {
        this.locationService.getLocationById(this.data.locationId)
        .subscribe(location => this.locationName = location.name);

        this.users$ = this.myTeamService.getTeamUsers();
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
        var userId = event.value as string; // check it
        this.data.lineManagerId = userId;
        this.myTeamService.updateTeamUser(this.data);
    }

    onSelectHandoverRecipient(event: any){
        var userId = event.value as string;
        this.data.recipientId = userId;
        this.myTeamService.updateTeamUser(this.data);
    }

    onSelectContributors(event: any){
        var userIds = event.value as string[];
        this.data.contributors = userIds;
        this.myTeamService.updateTeamUser(this.data);
    }
}
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MyTeamModel } from "src/app/models/myTeamModel";

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

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<HandoverInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: MyTeamModel
    ) {
        this.handoverInfoForm = this.fb.group({
            handoverOwner: [data.ownerName],
            role: [data.ownerRole],
            location:["Ukraine"] // get name by data.locationId
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
}
import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormControl } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTabsModule } from '@angular/material/tabs';
import { Guid } from "guid-typescript";
import { SubscriptionDetail } from "src/app/models/subscriptionDetail";

@Component({
    selector: 'account-tab',
    templateUrl: './account.component.html',
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
        MatAutocompleteModule,
        MatTabsModule
    ],
})
export class AccountTabComponent implements OnInit {
    accountForm: FormGroup;
    admin: boolean = true;

    subscriptionTempDetails: SubscriptionDetail =
    {
        version: "RelayWorks Version v2.2",
        purchaseDate: new Date().toLocaleString(),
        billingDate: new Date().toLocaleString(),
        planType: "Advanced", 
        timeZoneId: "Kiev",
        templatesLimit:3, 
        users: "8/75"
    }

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AccountTabComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SubscriptionDetail
    ) {
        this.data = this.subscriptionTempDetails;

        this.accountForm = this.fb.group({
            version: [this.subscriptionTempDetails.version],
            purchaseDate: [this.subscriptionTempDetails.purchaseDate],
            billingDate: [this.subscriptionTempDetails.billingDate],
            planType: [this.subscriptionTempDetails.planType],
            timeZone:/* [data.timeZoneId] */"Time Zone",
            templatesLimit:[this.subscriptionTempDetails.templatesLimit],
            usersCount: [this.subscriptionTempDetails.users]
        });
    }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.accountForm.valid) {
            this.dialogRef.close(this.accountForm.value);
        }
    }
}
import { Component, Inject, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatTabsModule } from '@angular/material/tabs';
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
export class AccountTabComponent {
    accountForm: FormGroup;
    admin: boolean = true;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<AccountTabComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SubscriptionDetail
    ) {
        this.accountForm = this.fb.group({
            version: data.version,
            purchaseDate: data.purchaseDate,
            billingDate: data.billingDate,
            planType: data.planType,
            timeZone: data.timeZoneId,
            templatesLimit: data.templatesLimit,
            usersCount: data.users
        });
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
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { CommonModule } from "@angular/common";
import { RecipientModel } from "../../models/recipientModel";
import { MyTeamModel } from "src/app/models/myTeamModel";
import { map, Observable } from "rxjs";
import { UserModel } from "src/app/models/user";
import { UserService } from "src/app/services/userService";

@Component({
    selector: 'handover-recipient',
    templateUrl: './handover-recipient.component.html',
    styleUrl: './handover-recipient.component.less',
    standalone: true,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    encapsulation: ViewEncapsulation.None,
    imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
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
    users$: Observable<UserModel[]>;
    hasUsers$!: Observable<boolean>;
    activeIndex: number | null = null; 

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<HandoverRecipientDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService
    ) 
    {
        this.recipientForm = this.fb.group({
            handoverId: data ? data.handoverId : null,
            recipientId: [data ? data.recipientId : null, Validators.required],
            templateId: data.templateId,
            endDateTime: data.endDateTime
        });
    }

    ngOnInit(): void {
        this.users$ = this.userService.getUsers();
        this.hasUsers$ = this.users$.pipe(map((users) => users.length > 0));
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.recipientForm.valid) {
            this.dialogRef.close(this.recipientForm.value);
        }
    }

    getLettersIcon(user: UserModel): string {
        return user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase();
    }

    selectMember(teamMember: UserModel, index: number) {
        this.activeIndex = index;
        this.recipientForm.get('recipientId').setValue(teamMember.userId);
    }
}
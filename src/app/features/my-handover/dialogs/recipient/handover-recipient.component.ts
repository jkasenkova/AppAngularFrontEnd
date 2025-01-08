import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { CommonModule } from "@angular/common";
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
            endDateTime: data.endDateTime,
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
        if(Boolean(user.name) && Boolean(user.surname)){
            var getLetters = [user.name[0] + user.surname[0]].join("");
            return getLetters;
        }
        return "";
    }

    selectMember(teamMember: UserModel, index: number) {
        this.activeIndex = index;
        this.recipientForm.get('recipientId').setValue(teamMember.id);
    }
}
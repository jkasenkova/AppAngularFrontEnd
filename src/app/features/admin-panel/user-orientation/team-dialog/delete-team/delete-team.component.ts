import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { Team } from "src/app/models/team";
import { RoleModel } from "src/app/models/role";
import { TeamService } from "src/app/services/teamServices";

@Component({
    selector: 'team-dialog',
    templateUrl: './delete-team.component.html',
    styleUrl: '/../../../../../styles/pop-up.less',
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
        NgbDatepickerModule
    ],
})
export class DeleteTeamDialogComponent implements OnInit{
    teamForm: FormGroup;
    isCanDelete: boolean = false;
    roles: RoleModel[];

    constructor(
        private fb: FormBuilder,
        private teamService: TeamService,
        public dialogRef: MatDialogRef<DeleteTeamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Team
    ) {
        this.teamForm = this.fb.group({
            teamName: [data.name, Validators.required],
            teamId:[data.id]
        });
    }

    ngOnInit(): void {

        this.teamService.getRolesByTeamId(this.data.id)
        .subscribe(roles =>
         {
            this.isCanDelete = roles.length > 0;
         });
     }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (this.teamForm.valid) {
            this.dialogRef.close(this.teamForm.value);
        }
    }
}
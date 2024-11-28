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
import { CommonModule } from "@angular/common";
import { LocationService } from "src/app/services/locationService";

@Component({
    selector: 'team-dialog',
    templateUrl: './edit-team.component.html',
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
        NgbDatepickerModule,
        CommonModule
    ],
})
export class EditTeamDialogComponent implements OnInit {
    teamForm: FormGroup;
    teams: Team[];

    constructor(
        private fb: FormBuilder,
        private locationService: LocationService,
        public dialogRef: MatDialogRef<EditTeamDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Team
    ) {
        this.teamForm = this.fb.group({
            name: [data.name, Validators.required],
            id:[data.id],
            locationId:[data.locationId]
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    ngOnInit(): void {
       this.locationService.getTeamsByLocationId(this.data.locationId)
       .subscribe(teams =>
        {
            this.teams = teams;
        });
    }

    onSave(): void {
        var teamName = this.teamForm.get('name').value;

        if(this.teams.find(t => t.name == teamName) != null){
            this.teamForm.get('name').setErrors({'existTeamName': true})
        }

        if (this.teamForm.valid) {
            this.dialogRef.close(this.teamForm.value);
        }
    }
}
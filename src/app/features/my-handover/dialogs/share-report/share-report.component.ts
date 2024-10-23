import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewEncapsulation } from "@angular/core";
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
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipsModule, MatChipInputEvent} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
    selector: 'share-report',
    templateUrl: './share-report.component.html',
    styleUrl: './share-report.component.less',
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
        MatGridListModule,
        CommonModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatChipsModule
    ]
})

export class ShareReportDialogComponent implements OnInit {
    shareForm: FormGroup;
    teamMembers: MyTeamModel[] = [];
    sharedMember: MyTeamModel[] = [];

    emailList: string[] = [];
    removable = true;
    public separatorKeysCodes = [ENTER, COMMA];

    //for test
    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            userId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            ownerRole: "Developer",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            userId: Guid.parse("db3fd6a0-e14f-43a1-9393-c5332dee29cd"),
            ownerRole: "Team Lead",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("e50c8635-4b51-4cdd-85ca-4ae35acb8bbd"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            userId: Guid.parse("f06e7c51-43e7-4c8d-b7dd-42c668384bc3"),
            ownerRole: "Product Manager",
            isActiveRotation: true, //get state from back by curentRotationId
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationId:  Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            lineManagerId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            curentRotationId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            selected: false
        }
    ]

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ShareReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Handover,
        private myTeamService: MyTeamService
    ) {
        this.teamMembers = this.teamRotationsTmp;

        data.shareEmails = ["jkasenkova@gmail.com", "peter@gmail.com", "vlad@gmail.com"]

        this.shareForm = this.fb.group({
            handoverId: [data.handoverId],
            sharedUsers: [data.shareUsers], // for test
            emails: [data.shareEmails]
        });
    }

    ngOnInit(): void {
        this.myTeamService.getTeamUsers().subscribe(teams =>{
            this.teamMembers = teams
        });
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (!this.shareForm.errors) {
            this.data.shareUsers = this.shareForm.get('sharedUsers').value;
            this.data.shareEmails = this.shareForm.get('emails').value;
            this.dialogRef.close(this.shareForm.value);
        }
    }

    displayFn(email?: string): string | undefined {
        return email ? email : undefined;
    }

    add(event: any): void {
        if (event.value) {
            if (this.validateEmail(event.value)) {
              this.emailList.push(event.value);
              this.shareForm.controls['emails'].setErrors({'incorrectEmail': false});
            } else {
              this.shareForm.controls['emails'].setErrors({'incorrectEmail': true});
            }
          }
          if (event.input) {
            event.input.value = '';
          }
      }

      private validateEmail(email: string) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }

      removeEmail(data: any): void {
        if (this.emailList.indexOf(data) >= 0) {
          this.emailList.splice(this.emailList.indexOf(data), 1);
        }
      }

      displayEmailChip(email:string): string{
        return email.split('@')[0];
      }

      getLettersIcon(ownerName: string): string {
        var getLetters = ownerName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
    }

    setUserAlwaysShare(user: MyTeamModel){
        this.data.shareUsers.push(user);
    }

    setEmailAlwaysShare(email:string){
        this.data.shareEmails.push(email);
    }
}
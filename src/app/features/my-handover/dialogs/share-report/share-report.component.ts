import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list'; 
import { MyTeamModel } from "src/app/models/myTeamModel";
import { CommonModule } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatChipsModule} from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ShareRecipient } from "src/app/models/shareRecipientModel";
import { MyTeamService } from "src/app/services/myTeamService";
import { ShareReportModel } from "../../models/shareReportModel";

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
    handoverOwner: MyTeamModel;
    emailList: string[] = [];
    public separatorKeysCodes = [ENTER, COMMA];

    alwaysHandoverRecipients: ShareRecipient = {
        emails: [],
        usersIds: []
    };

    constructor(
        fb: FormBuilder,
        public dialogRef: MatDialogRef<ShareReportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ShareReportModel,
        private myTeamService: MyTeamService) 
    {
        this.shareForm = fb.group(
        {
            ownerId: data.ownerId,
            handoverId: data.handoverId,
            sharedUsers: [data.shareUsers],
            shareEmails: [data.shareEmails],
            teamMembers: data.teamMembers
        });
    }

    selectionChange(){
        this.shareForm.get('sharedUsers').setValue(
            this.shareForm.get('sharedUsers').value
            .concat(this.data.shareUsers));
    }

    ngOnInit(): void {
        this.myTeamService.getTeamUser(this.data.ownerId).subscribe(handoverOwner =>{
            this.handoverOwner = handoverOwner;
        });
    }
    
    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {
        if (!this.shareForm.errors) {

            if(this.alwaysHandoverRecipients && this.handoverOwner){
                this.handoverOwner.alwaysShareRecipient = this.alwaysHandoverRecipients;
                this.myTeamService.updateTeamUser(this.handoverOwner);
            }
            this.dialogRef.close(this.shareForm.value);
        }
    }

    add(event: any): void {
        if (event.value) {
            if (this.validateEmail(event.value)) {

                if(!this.emailList.includes(event.value)){
                    this.data.shareEmails.push(event.value);
                    this.shareForm.controls['shareEmails'].setValue(this.data.shareEmails);
                    this.shareForm.controls['shareEmails'].setErrors({'incorrectEmail': false});
                }
                else{
                    this.shareForm.controls['shareEmails'].setErrors({'duplicateEmail': true});
                }

              
            } else {
              this.shareForm.controls['shareEmails'].setErrors({'incorrectEmail': true});
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


      deleteUser(data: any): void {
        this.data.shareUsers = this.shareForm.get('sharedUsers').value;

        if (this.data.shareUsers.indexOf(data) >= 0) {
            this.data.shareUsers.splice(this.data.shareUsers.indexOf(data), 1);
        }
        this.shareForm.controls['sharedUsers'].setValue(this.data.shareUsers);
      }

      deleteEmail(data: any): void {
        if (this.data.shareEmails.indexOf(data) >= 0) {
            this.data.shareEmails.splice(this.data.shareEmails.indexOf(data), 1);
        }
      }

      getLettersIcon(ownerName: string): string {
        var getLetters = ownerName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
    }

    setUserAlwaysShare(user: MyTeamModel){
        this.alwaysHandoverRecipients.usersIds.push(user.userId);
    }

    setEmailAlwaysShare(email: string){
        this.alwaysHandoverRecipients.emails.push(email);
    }
}
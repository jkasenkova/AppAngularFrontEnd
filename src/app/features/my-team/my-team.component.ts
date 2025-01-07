import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyTeamModel } from '@models/myTeamModel';
import { UserService } from '@services/userService';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HandoverInfoComponent } from './handover-info/handover-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyHandoverComponent } from '../my-handover/my-handover.component';
import { Observable, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [
        MatTabsModule,
        CommonModule,
        MatTooltipModule,
        MyHandoverComponent,
        AsyncPipe
    ], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team.component.html',
    styleUrls: ['./my-team.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class MyTeamComponent implements OnInit {
    totalUsersCount: number;
    users$: Observable<MyTeamModel[]>;
    readonly dialog = inject(MatDialog);
    urlMyTeam: string = "my-team";
    
    constructor(
        private cdr: ChangeDetectorRef,
        private userService: UserService){}

    ngOnInit(): void {
        this.users$ = this.userService.getMyTeamUsers();
    }

    ngAfterViewChecked(){
        this.cdr.detectChanges();
     }

    getLetters(teamRotation: MyTeamModel): string {
        if(teamRotation.ownerName){
            var getLetters = teamRotation.ownerName
            .split(" ")
            .map(n => n[0])
            .join("");
    
            return getLetters;
        }
       else{
        return "";
       }
    }

    handoverInfo(teamRotation: MyTeamModel){
        const dialogRef = this.dialog.open(HandoverInfoComponent,
            {
                data: teamRotation
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                
            }
        });
    }

    contributorsInfo(teamRotation: MyTeamModel): string {
        //const contributors = this.teamRotations.filter(c => teamRotation.contributors.includes(c.userId));
        return ''; //contributors.flatMap(c => c.ownerName).join('\n');
    }
}
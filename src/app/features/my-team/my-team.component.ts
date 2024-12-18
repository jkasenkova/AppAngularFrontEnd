import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyTeamModel } from 'src/app/models/myTeamModel';
import { MyTeamService } from 'src/app/services/myTeamService';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HandoverInfoComponent } from './hondover-info/handover-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyHandoverComponent } from '../my-handover/my-handover.component';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [
        MatTabsModule,
        CommonModule,
        MatTooltipModule,
        MyHandoverComponent
    ], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team.component.html',
    styleUrls: ['./my-team.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class MyTeamComponent implements OnInit {
    totalUsersCount: number;
    teamRotations: MyTeamModel[] = [];
    readonly dialog = inject(MatDialog);
    urlMyTeam: string = "my-team";
    
    constructor(
        private cdr: ChangeDetectorRef,
        private myTeamService: MyTeamService){}

    ngOnInit(): void {
        this.myTeamService.getTeamUsers().subscribe(teams =>{
            this.teamRotations = teams
        });
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

    hadoverInfo(teamRotation: MyTeamModel){
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

       var contribitors = this.teamRotations.filter(c => 
        teamRotation.contributors.includes(c.userId));

        return contribitors.flatMap(c => c.ownerName).join('\n');
    }
}
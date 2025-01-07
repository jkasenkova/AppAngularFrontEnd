import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MyTeamModel } from 'src/app/models/myTeamModel';
import { MyTeamService } from 'src/app/services/myTeamService';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HandoverInfoComponent } from '../handover-info/handover-info.component';
import { Observable } from 'rxjs';

@Component({
    selector: 'handover',
    standalone: true,
    imports: [
        MatTabsModule,
        CommonModule,
        MatTooltipModule
    ], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './handover.component.html',
    styleUrls: ['./handover.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class HandoverComponent implements OnInit {
    totalUsersCount: number;
    teamRotations$: Observable<MyTeamModel[]>;
    readonly dialog = inject(MatDialog);
    urlMyTeam: string = "my-team";
    
    constructor(
        private cdr: ChangeDetectorRef,
        private myTeamService: MyTeamService){}

    ngOnInit(): void {
        this.teamRotations$ = this.myTeamService.getTeamUsers();
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
        /* const contributors = this.teamRotations$.pipe(map(x => x.filter(c => 
            teamRotation.contributors.includes(c.userId)).flatMap(c => c.ownerName).join('\n')))
            .subscribe();

        return contributors.flatMap(c => c.ownerName).join('\n'); */
        return '';
    }
}
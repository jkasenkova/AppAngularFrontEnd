import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Guid } from 'guid-typescript';
import { MyTeamModel } from 'src/app/models/myTeamModel';
import { TabsMenuComponent } from '../tabs-menu/tabs-menu.component';
import { MyTeamService } from 'src/app/services/myTeamService';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HandoverInfoComponent } from './hondover-info/handover-info.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [
        MatTabsModule,
        TabsMenuComponent, 
        CommonModule,
        MatTooltipModule
    ], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team.component.html',
    styleUrls: ['./my-team.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class MyTeamComponent implements OnInit {
    totalUsersCount: number;
    teamRotations: MyTeamModel[];
    readonly dialog = inject(MatDialog);
    
    constructor(private myTeamService: MyTeamService){}

    //data for test
    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            ownerRole: "Developer",
            userId: Guid.parse('fd12a119-8ca5-4bc3-98b2-127dbcad94b1'),
            isActiveRotation : true,
            recipientId: Guid.parse('825ece43-c3f2-4446-886b-0ed2061bed45'),
            locationid: Guid.parse('a03b066d-f8a1-43f9-ad59-0a761aa8c7b4'),
            lineManagerId: Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),
            curentRotationId:  Guid.parse("c7f97421-f082-4af0-bccb-7b8d9419efe0"),
            contributors: [Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),Guid.parse('91e8a26c-abd1-4cc0-b594-5ca725834379') ]
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            ownerRole: "Team Lead",
            userId: Guid.parse('825ece43-c3f2-4446-886b-0ed2061bed45'),
            isActiveRotation : true,
            recipientId: Guid.parse("fd12a119-8ca5-4bc3-98b2-127dbcad94b1"),
            locationid: Guid.parse("a03b066d-f8a1-43f9-ad59-0a761aa8c7b4"),
            lineManagerId: Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),
            curentRotationId:  Guid.parse("a00387dd-a9a0-40b3-b2d9-78d7c066aa52"),
            contributors: [Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),Guid.parse('91e8a26c-abd1-4cc0-b594-5ca725834379') ]
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            ownerRole: "Product Manager",
            userId: Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),
            isActiveRotation : false,
            recipientId: Guid.parse("91e8a26c-abd1-4cc0-b594-5ca725834379"),
            locationid: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            lineManagerId: Guid.parse("91e8a26c-abd1-4cc0-b594-5ca725834379"),
            curentRotationId: Guid.parse("c6477d5e-a7f3-455b-b943-d20b0b40e90d")
        },
        {
            ownerName: "Kevin Burt",
            ownerEmail: "kevin_burt@gmail.com",
            ownerRole: "Company Director",
            userId: Guid.parse('91e8a26c-abd1-4cc0-b594-5ca725834379'),
            isActiveRotation : false,
            recipientId: Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),
            locationid: Guid.parse("d5e65215-09a4-4d28-842d-25995018860c"),
            lineManagerId: Guid.parse('d121ded4-8f1a-4f3c-aea5-cffc6c6985c7'),
            curentRotationId: null
        },
    ];


    ngOnInit(): void {
        this.teamRotations = this.teamRotationsTmp;
    }

    getLetters(teamRotation: MyTeamModel): string {
        var getLetters = teamRotation.ownerName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
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

       var contribitors = this.teamRotationsTmp.filter(u => 
        teamRotation.contributors.find(c=> c.toString() == u.userId.toString()) != null);

        return contribitors.flatMap(c => c.ownerName).join('\n');
    }
}
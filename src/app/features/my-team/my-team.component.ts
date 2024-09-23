import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { Guid } from 'guid-typescript';
import { MyTeamModel } from 'src/app/models/myTeamModel';
import { TabsMenuComponent } from '../tabs-menu/tabs-menu.component';
import { MyTeamService } from 'src/app/services/myTeamService';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HandoverInfoComponent } from './hondover-info/handover-info.component';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [
        MatTabsModule,
        TabsMenuComponent, 
        CommonModule
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
    
    constructor(private myTeamService: MyTeamService){
        
    }

    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            ownerRole: "Developer",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : true,
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationid: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            ownerRole: "Team Lead",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : true,
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationid: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            ownerRole: "Product Manager",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : false,
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationid: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        },
        {
            ownerName: "Kevin Burt",
            ownerEmail: "kevin_burt@gmail.com",
            ownerRole: "Company Director",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : false,
            recipientId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            locationid: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb")
        },
    ]

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
}
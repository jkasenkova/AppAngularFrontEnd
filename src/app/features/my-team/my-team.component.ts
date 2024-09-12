import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Guid } from 'guid-typescript';
import { MyTeamModel } from 'src/app/models/myTeamModel';
import { TabsMenuComponent } from '../tabs-menu/tabs-menu.component';
import { MyTeamService } from 'src/app/services/myTeamService';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [TabsMenuComponent, CommonModule], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team.component.html',
    styleUrls: ['./my-team.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class MyTeamComponent implements OnInit {
    totalUsersCount: number;
    teamRotations: MyTeamModel[];

    constructor(private myTeamService: MyTeamService){
        
    }

    teamRotationsTmp: MyTeamModel[] = [
        {
            ownerName: "Julia Kasenkova",
            ownerEmail: "jkasenkova@gmail.com",
            ownerPosition: "Developer",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : true
        },
        {
            ownerName: "Peter Hlazunov",
            ownerEmail: "peter_hlazunov@gmail.com",
            ownerPosition: "Team Lead",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : true
        },
        {
            ownerName: "Vlad Gurov",
            ownerEmail: "vlad_gurov@gmail.com",
            ownerPosition: "Product Manager",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : false
        },
        {
            ownerName: "Kevin Burt",
            ownerEmail: "kevin_burt@gmail.com",
            ownerPosition: "Company Director",
            userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
            isActiveRotation : false
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

    onTabChanged(event: MatTabChangeEvent): void {
      
    }
}
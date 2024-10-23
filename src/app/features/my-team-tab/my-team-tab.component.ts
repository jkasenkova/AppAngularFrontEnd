import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabsMenuComponent } from '../tabs-menu/tabs-menu.component';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-my-team-tab',
    standalone: true,
    imports: [
        MatTabsModule,
        TabsMenuComponent, 
        CommonModule,
        MatTooltipModule
    ], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team-tab.component.html',
    encapsulation: ViewEncapsulation.None
})

export class MyTeamTabComponent {
    urlMyTeam: string = "my-team";
    
    constructor(){}
}
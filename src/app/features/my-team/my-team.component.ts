import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MyHandoverComponent } from '../my-handover/my-handover.component';
import { HandoverComponent } from './handovers/handover.component';
import { SessionStorageService } from '../../services/sessionStorageService';

@Component({
    selector: 'app-my-team',
    standalone: true,
    imports: [
        MatTabsModule,
        CommonModule,
        MatTooltipModule,
        MyHandoverComponent,
        HandoverComponent
    ], 
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './my-team.component.html',
    styleUrls: ['./my-team.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class MyTeamComponent implements OnInit {
    selectedIndex = 1;

    constructor(private sessionStorageService: SessionStorageService) {}

    ngOnInit(): void {
        this.selectedIndex = this.sessionStorageService.getItem<number>('active-tab');
    }

    onTabChanged(event: MatTabChangeEvent): void {
        this.sessionStorageService.setItem('active-tab', event.index.toString());
    }
}
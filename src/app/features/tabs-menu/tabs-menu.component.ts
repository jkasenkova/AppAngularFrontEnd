import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { SessionStorageService } from '../../services/sessionStorageService';
import { UserOrientationComponent } from '../admin-panel/user-orientation/user-orientation.component';
import { UserManagementComponent } from '../admin-panel/user-management/user-management.component';
import { HandoverTemplatesComponent } from '../admin-panel/handover-templates/handover-templates.component';
import { MyHandoverComponent } from '../my-handover/my-handover.component';
import { MyTeamComponent } from '../my-team/my-team.component';

@Component({
    selector: 'app-tabs-menu',
    standalone: true,
    imports: [
        MatTabsModule,
        UserOrientationComponent,
        UserManagementComponent,
        HandoverTemplatesComponent,
        MyHandoverComponent,
        MyTeamComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './tabs-menu.component.html',
    styleUrls: ['./tabs-menu.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class TabsMenuComponent implements OnInit {
    teamTab: boolean = true;
    adminTab: boolean;
    selectedIndex = 1;

    @Input() urlActive: string; 
    @Output() handoverAdmin = new EventEmitter<boolean>();

    constructor(
        private sessionStorageService: SessionStorageService) {}
    
    ngOnInit(): void {
        this.selectedIndex = this.sessionStorageService.getItem<number>('active-tab');
        this.handoverAdmin.emit(true);
    }

    onTabChanged(event: MatTabChangeEvent): void {
        this.sessionStorageService.setItem('active-tab', event.index.toString());
    }
}
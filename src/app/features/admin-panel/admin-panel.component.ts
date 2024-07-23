import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { HandoverTemplatesComponent } from './handover-templates/handover-templates.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserOrientationComponent } from './user-orientation/user-orientation.component';
import { SessionStorageService } from '../../services/sessionStorageService';


@Component({
    selector: 'app-admin-panel',
    standalone: true,
    imports: [
        MatTabsModule,
        HandoverTemplatesComponent,
        UserManagementComponent,
        UserOrientationComponent
    ],
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.less'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    encapsulation: ViewEncapsulation.None
})

export class AdminPanelComponent implements OnInit {
    selectedIndex = 1;
    constructor(private sessionStorageService: SessionStorageService) {}

    ngOnInit(): void {
        this.selectedIndex = this.sessionStorageService.getItem<number>('active-tab');
    }

    onTabChanged(event: MatTabChangeEvent): void {
        this.sessionStorageService.setItem('active-tab', event.index.toString());
    }
}

import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
    selector: 'app-tabs-menu',
    standalone: true,
    imports: [MatTabsModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './tabs-menu.component.html',
    styleUrls: ['./tabs-menu.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class TabsMenuComponent implements OnInit {
    teamTab: boolean = true;
    adminTab: boolean;
    @Input() url: string;
    
    ngOnInit(): void {

    }

}
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UserModel } from "@models/user";

@Component({
    selector: 'view-user-panel',
    standalone: true,
    imports: [
        FormsModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './view-user-panel.component.html',
    styleUrls: ['./view-user-panel.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class ViewUserPanelComponent implements OnInit {
    @Input() handoverOwner: UserModel; 
    
    ngOnInit(): void {
    }
}
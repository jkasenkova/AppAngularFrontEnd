import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UserModel } from "@models/user";
import { Location, CommonModule } from '@angular/common';
import { Observable } from "rxjs";
import { UserService } from "@services/userService";

@Component({
    selector: 'view-user-panel',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './view-user-panel.component.html',
    styleUrls: ['./view-user-panel.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class ViewUserPanelComponent implements OnInit{
    @Input() viewerId: string; 
    user$: Observable<UserModel>;
    
    constructor(
        private location: Location, 
        private userService: UserService) {}

    ngOnInit(): void {
        this.user$ = this.userService.getUser(this.viewerId);
    }

    goBack(): void {
        this.location.back();
    }
}
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, RouterOutlet } from "@angular/router";
import { Subscription } from "../models/subscription";
import { Guid } from "guid-typescript";
import { SubscriptionStatus } from "../models/subscriptionStatus";
import { MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'subscriptions-management',
    standalone: true,
    imports: [
        RouterOutlet,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './subscriptions-management.component.html',
    styleUrls: ['./subscriptions-management.component.less'],
    encapsulation: ViewEncapsulation.None
})

export class SubscriptionManagementComponent implements OnInit {
    subscriptions: Subscription[];
    currentYear: number;
    //for test
    subscriptionsTmp: Subscription[] = [
        {
            id: Guid.parse('fd12a119-8ca5-4bc3-98b2-127dbcad94b1'),
            timeZoneId: "Dublin, Kiev",
            status: SubscriptionStatus.Active,
            createdDate: "26/09/24",
            activeHandovers: "4",
            limitUsers: "10",
            email: "jkasenkova@gmail.com"
        },
        {
            id: Guid.parse('7afc81b6-4a52-4cdd-bcc6-87cd8d0e2b8b'),
            timeZoneId: "Dublin, Kiev",
            status: SubscriptionStatus.Active,
            createdDate: "20/09/24",
            activeHandovers: "3",
            limitUsers: "15",
            email: "user1@gmail.com"
        },
        {
            id: Guid.parse('e53f1141-8383-4540-882a-b78c561e342e'),
            timeZoneId: "Dublin, Kiev",
            status: SubscriptionStatus.Blocked,
            createdDate: "10/08/24",
            activeHandovers: "2",
            limitUsers: "20",
            email: "user2@gmail.com"
        }
    ];

    ngOnInit(): void {
        this.subscriptions = this.subscriptionsTmp;

        this.currentYear = new Date().getFullYear();
    }
}
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { RouterModule, RouterOutlet } from "@angular/router";
import { Subscription } from "../models/subscription";
import { MatIconModule} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from "../services/auth/auth.service";

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

    constructor(
        private authService: AuthService) {
    }

    ngOnInit(): void {
        this.authService.getAccounts().subscribe(accounts => this.subscriptions = accounts);
        console.log(typeof this.subscriptions);
        this.currentYear = new Date().getFullYear();
    }
}
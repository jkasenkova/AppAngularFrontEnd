import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AdminPanelComponent } from './features/admin-panel/admin-panel.component';
import { MyTeamComponent } from './features/my-team/my-team.component';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { MyHandoverComponent } from './features/my-handover/my-handover.component';
import { UserOrientationComponent } from './features/admin-panel/user-orientation/user-orientation.component';
import { UserService } from './services/userService';
import { SubscriptionService } from './services/subscriptionService';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from './features/profile-dialog/profile-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserModel } from './models/user';
import { Guid } from 'guid-typescript';
import { SignInComponent } from './sign-in/sign-in.component';
import { FooterComponent } from './features/footer/footer.component';
import { TabsMenuComponent } from './features/tabs-menu/tabs-menu.component';
import { MyTeamTabComponent } from './features/my-team-tab/my-team-tab.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatButtonModule,
        RouterOutlet,
        MatToolbarModule,
        MatIconModule,
        AdminPanelComponent,
        MyTeamComponent,
        MyHandoverComponent,
        MatMenuModule,
        RouterModule,
        UserOrientationComponent,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        SignInComponent,
        FooterComponent,
        TabsMenuComponent,
        MyTeamTabComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    userName: string;
    readonly dialog = inject(MatDialog);
    isAdmin: boolean = true;
    adminId: Guid;
    admin: UserModel = new UserModel();
    subscriptionId: Guid;
    url: string;
    isAuth: boolean = true;
    @Output() urlActive = new EventEmitter<string>();

    constructor(
        private router: Router, 
        private userService: UserService,
        private subscriptionService: SubscriptionService) {}

    ngOnInit(): void {
        //get subscriptionId Id

        this.subscriptionService.getSubscriptionById(this.subscriptionId).subscribe(subscription =>
            this.adminId = subscription.adminId
        );

        this.userService.getUser(this.adminId).subscribe(admin =>
            this.admin = admin
        );

        // it for test (hard code)
        var urlCur = window.location.pathname; 

        if(urlCur == "/subscriptions-management" || urlCur == "/sign-up"){
            this.isAuth = false;
        }
    }

    navigateToPage(url: string, event: Event){

        var elems = document.querySelector(".active");
        if(elems !== null){
            elems.classList.remove("active");
        }
        var element = event.target as HTMLElement;
        element.classList.add('active');

        this.url = url;

        if(url == "/sign-in"){
            this.isAuth = false;
        }

        this.urlActive.emit(this.url);
        this.router.navigate([url]);
    }

    getFullName(): string {

        if(Boolean(this.admin.userName) && Boolean(this.admin.userSurname)){
            
            var getLetters = [this.admin.userName[0] + this.admin.userSurname[0]].join("");
            return getLetters;
        }

        return "";
    }

    getProfile(){
        const dialogRef = this.dialog.open(ProfileDialogComponent, { 
            data: this.admin
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}


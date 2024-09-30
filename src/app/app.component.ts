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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from './features/profile-dialog/profile-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserModel } from './models/user';
import { Guid } from 'guid-typescript';
import { SignInComponent } from './sign-in/sign-in.component';
import { FooterComponent } from './features/footer/footer.component';
import { TabsMenuComponent } from './features/tabs-menu/tabs-menu.component';

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
        TabsMenuComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    userName: string = "Julia Kasenkova"; //for test;
    readonly dialog = inject(MatDialog);
    admin: boolean = true;
    url: string;
    isAuth: boolean = true;
    @Output() urlActive = new EventEmitter<string>();

    userTemp: UserModel =
    {
        userId: Guid.parse("314d09a4-cb44-4c08-99d7-15d3441bc3cb"),
        userName: "Julia",
        userSurname: "Kasenkova",
        email: "jkasenkova@gmail.com",
        password: "HgBx9TR227Tu",
        roleId: Guid.parse("25e11aea-21c2-4257-99b2-bf6178d03526"),
        teamId: Guid.parse("db04e6a3-eb50-4f14-925c-d5732fb82862"),
        companyId: Guid.parse("80f73fe0-851f-4194-bde9-0992d9000553"),
        title: "Mrs"
    };

    constructor(
        private router: Router, 
        private userService: UserService) {}

    ngOnInit(): void {

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
        debugger;
        this.urlActive.emit(this.url);

        this.router.navigate([url]);
    }

    getFullName(): string {

        /* this.userService.getAvatar().subscribe(userName => {
            this.userName = userName;
        }); */

        var getLetters = this.userName
        .split(" ")
        .map(n => n[0])
        .join("");

        return getLetters;
    }

    getProfile(){
        const dialogRef = this.dialog.open(ProfileDialogComponent, { 
            data: this.userTemp
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }
}


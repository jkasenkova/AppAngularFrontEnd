import { Component, inject, OnInit } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileDialogComponent } from './features/profile-dialog/profile-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { UserModel } from './models/user';
import { Guid } from 'guid-typescript';
import { SignInComponent } from './services/auth/sign-in/sign-in.component';
import { FooterComponent } from './features/footer/footer.component';
import { AuthFacade } from './services/auth/store/auth.facade';

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
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    userName: string;
    readonly dialog = inject(MatDialog);
    isAdmin: boolean;
    admin: UserModel = new UserModel();
    isAuth: boolean;

    constructor(
        private authFacade: AuthFacade,
        private router: Router) {}

    ngOnInit(): void {
        this.authFacade.isLoggedIn$.subscribe(isLoggedIn => {
            this.isAuth = isLoggedIn;   
        });
        this.authFacade.isAdmin$.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });

        this.authFacade.getIsAdmin().subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });

        this.isAdmin = true; //test
    }

    getProfileName(): string {
        if(Boolean(this.admin.firstName) && Boolean(this.admin.lastName)){
            var getLetters = [this.admin.firstName[0] + this.admin.lastName[0]].join("");
            return getLetters;
        }
        return "";
    }

    getProfileDialog(){
        const dialogRef = this.dialog.open(ProfileDialogComponent, { 
            data: this.admin
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    logOut(){
      //  this.isAuth = false; reset this data
        this.router.navigate(['/sign-in']);
    }
}


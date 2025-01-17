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
import { FooterComponent } from './features/footer/footer.component';
import { AuthFacade } from './services/auth/store/auth.facade';
import { AuthUser } from './services/auth/store/auth.models';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatButtonModule,
        RouterOutlet,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        FooterComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
    isAdmin: boolean;
    user: AuthUser;
    isAuth: boolean;

    constructor(
        private authFacade: AuthFacade,
        private router: Router,
        private readonly dialog: MatDialog) {}

    ngOnInit(): void {
        this.authFacade.isLoggedIn$.subscribe(isLoggedIn => {
            this.isAuth = isLoggedIn;   
        });
        this.authFacade.isAdmin$.subscribe(isAdmin => {
            this.isAdmin = isAdmin;
        });

        this.authFacade.state.subscribe(data => {
            this.user = data.authUser;
        });

        if(!this.isAuth) {
            this.router.navigate(['/sign-in']);
        } 
    }

    getProfileName(): string {
        if(Boolean(this.user.firstName) && Boolean(this.user.lastName)){
            var getLetters = [this.user.firstName[0] + this.user.lastName[0]].join("");
            return getLetters;
        }
        return "";
    }

    getProfileDialog(){
        const dialogRef = this.dialog.open(ProfileDialogComponent, { 
            data: this.user
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
        
            }
        });
    }

    logOut(){
        this.authFacade.signOut();
    }
}


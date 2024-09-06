import { Component } from '@angular/core';
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
        UserOrientationComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent {

    constructor(private router: Router) {}

    navigateToPage(page: string, event: Event){

        var elems = document.querySelector(".active");
        if(elems !== null){
            elems.classList.remove("active");
        }

        var element = event.target as HTMLElement;
        element.classList.add('active');

        this.router.navigate([page]);
      }
}

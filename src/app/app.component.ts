import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AdminPanelComponent } from './features/admin-panel/admin-panel.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        MatButtonModule,
        RouterOutlet,
        MatToolbarModule,
        MatIconModule,
        AdminPanelComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less'],
})
export class AppComponent {
}

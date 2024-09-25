import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { MyHandoverComponent } from './app/features/my-handover/my-handover.component';
import { MyTeamComponent } from './app/features/my-team/my-team.component';
import { AdminPanelComponent } from './app/features/admin-panel/admin-panel.component';
import { SignInComponent } from './app/sign-in/sign-in.component';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

const providers = [
    {
        provide: 'BASE_URL', useFactory: getBaseUrl
    }
];

const routes: Routes =
    [
        {
            path: '', pathMatch: 'full', redirectTo: 'my-team'
        },
        {
            path: 'my-handover', component: MyHandoverComponent
        },
        {
            path: 'my-team', component: MyTeamComponent
        },
        {
            path: 'admin-panel', component: AdminPanelComponent
        },
        {
            path: 'sign-in', component: SignInComponent
        }
      /*   {
            path: 'admin-panel', loadChildren: () => import('./app/features/admin-panel/admin-panel.routes').then(mod => mod.ADMIN_PANEL_ROUTES)
        },  */
    ];


bootstrapApplication(AppComponent,
    {
        providers: [
            provideHttpClient(),
            provideAnimations(),
            providers,
            importProvidersFrom(RouterModule.forRoot(routes))
        ]
    });



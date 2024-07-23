import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
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
            path: 'admin', loadChildren: () => import('./app/features/admin-panel/admin-panel.routes').then(mod => mod.ADMIN_PANEL_ROUTES)
        }
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



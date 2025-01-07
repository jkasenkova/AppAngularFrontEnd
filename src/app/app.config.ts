import {
    provideHttpClient,
    withInterceptors,
    withInterceptorsFromDi,
} from '@angular/common/http';
import {
    ApplicationConfig,
    provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore, routerReducer } from '@ngrx/router-store';
import { provideStore } from '@ngrx/store';

import { environment } from '../environments/environment';

import { APP_ROUTES } from './app.routes';
import { provideAuthStore } from './services/auth';
import { hydrationMetaReducer } from './services/auth/store/hydrationMeta.reducer';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}
export const appConfig: ApplicationConfig = {
    providers: [
        { provide: 'BASE_URL', useFactory: getBaseUrl },
        // Setup Angular
        provideExperimentalZonelessChangeDetection(),
        provideAnimationsAsync(),

        // Setup NgRx
        provideStore({ router: routerReducer }),
        provideRouterStore(),
        provideEffects(),

        // Setup Interceptors
        provideHttpClient(
        withInterceptorsFromDi(),
        ),

        // Setup Application
        provideAuthStore(),
        provideRouter(APP_ROUTES),
    ],
};
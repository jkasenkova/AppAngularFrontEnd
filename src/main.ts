import { provideHttpClient, withInterceptorsFromDi, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { provideStore, ReducerManager, ReducerManagerDispatcher, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';

import { AppComponent } from './app/app.component';
import { AuthService, authServiceInitProvider } from './app/services/auth/auth.service';
import { authInterceptorProviders, AuthInterceptor } from './app/services/auth/interceptors/auth.interceptor';
import { AuthEffects } from './app/services/auth/store/auth.effects';
import { AuthFacade } from './app/services/auth/store/auth.facade';
import { authReducer } from './app/services/auth/store/auth.reducer';
import { APP_ROUTES } from './app/app-routes';

export function getBaseUrl() {
    return document.getElementsByTagName('base')[0].href;
}

const providerRegistry = [
    { provide: 'BASE_URL', useFactory: getBaseUrl },
    { provide: 'StoreRootModule', useClass: StoreModule },
    { provide: 'ReducerManager', useClass: ReducerManager },
    { provide: 'AuthService', useClass: AuthService },
    authInterceptorProviders
];

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations(),
        providerRegistry,
        importProvidersFrom(RouterModule.forRoot(APP_ROUTES, {
            scrollPositionRestoration: 'enabled'
        })),
        provideStore({ auth: authReducer }),
        provideEffects([AuthEffects])
    ]
});
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AuthService, authServiceInitProvider } from './auth.service';
import { authInterceptorProviders } from './interceptors/auth.interceptor';
import { AuthEffects } from './store/auth.effects';
import { AuthFacade } from './store/auth.facade';
import { AUTH_FEATURE_KEY, authReducer } from './store/auth.reducer';
import { noAuthGuard } from './guards/no-auth.guard';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sign-in',
    loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SignInComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'sign-up',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature(AUTH_FEATURE_KEY, authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [AuthFacade, AuthService, authServiceInitProvider, authInterceptorProviders],
})
export class AuthModule {}
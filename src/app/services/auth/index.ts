import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { authServiceInitProvider } from './auth.service';
import { authInterceptorProviders } from './interceptors';
import { AuthEffects } from './store/auth.effects';
import { authReducer } from './store/auth.reducer';
import { AUTH_FEATURE_KEY } from './store/auth.models';

export function provideAuthStore() {
  return [
    provideState(AUTH_FEATURE_KEY, authReducer),
    provideEffects(AuthEffects),
    authServiceInitProvider,
    authInterceptorProviders,
  ];
}
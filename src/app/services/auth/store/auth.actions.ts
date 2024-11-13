import { createAction, props, emptyProps, createActionGroup } from '@ngrx/store';
import { AuthUser } from './auth.models';

// Sign In
export const SignInActions = createActionGroup({
  source: '[Auth] Sign In',
  events: {
    request: props<{ username: string; password: string }>(),
    success: emptyProps(),
    failure: props<{ error: Error }>(),
  },
});

// Sign Out
export const signOut = createAction('[Auth] Sign Out');

// Auth User: me
export const GetAuthUserActions = createActionGroup({
  source: '[Auth] Auth User',
  events: {
    request: emptyProps(),
    success: props<{ user: AuthUser }>(),
    failure: emptyProps(),
  }
});

// Refresh token
export const RefreshTokenActions = createActionGroup({
  source: '[Auth] Refresh Token',
  events: {
    request: emptyProps(),
    success: emptyProps(),
    failure: emptyProps(),
  }
});
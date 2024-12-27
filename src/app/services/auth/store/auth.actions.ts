import { createAction, props, emptyProps, createActionGroup } from '@ngrx/store';
import { AuthUser } from './auth.models';

// Login
export const LoginActions = createActionGroup({
  source: '[Auth] Login',
  events: {
    request: props<{ email: string; password: string }>(),
    success: props<{ email: string; password: string }>(),
    failure: props<{ error: Error }>(),
  }
});

// Sign In
export const SignInActions = createActionGroup({
  source: '[Auth] Sign In',
  events: {
    request: props<{ email: string; password: string }>(),
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
    request: props<{ user: AuthUser }>(),
    success: emptyProps(),
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

// Token
export const TokenActions = createActionGroup({
  source: '[App] Token',
  events: {
    request: props<{ user: AuthUser }>(),
  }
});
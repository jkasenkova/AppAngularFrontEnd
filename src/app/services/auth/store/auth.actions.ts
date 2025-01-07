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
    success: props<{ user: AuthUser }>(),
    finalize: emptyProps(),
    failure: props<{ error: Error }>(),
  },
});

// Sign Out
export const SignOutActions = createActionGroup({
  source: '[Auth] Sign Out',
  events: {
    request: emptyProps(),
    success: emptyProps(),
    failure: props<{ error: Error }>(),
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
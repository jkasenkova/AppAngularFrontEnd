import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.models';

export const AUTH_FEATURE_KEY = 'auth';

export interface AppState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export const selectAuth = (state: AppState) => state.auth;

export const selectState = createSelector(selectAuth, (state) => state);

export const selectIsSignedIn = createSelector(selectAuth, (state) => state.isSignedIn);

export const selectLoginError = createSelector(selectAuth, (state) => state.hasLoginError);

export const selectIsLoadingLogin = createSelector(selectAuth, (state) => state.isLoadingLogin);

export const selectIsAdmin = createSelector(
  selectAuth,
  (state) => state.authUser.role.RoleName === 'Administrator' || state.authUser.role.RoleName === 'RootAdmin');
    
export const selectIsRootAdmin = createSelector(
  selectAuth,
  (state) => state.authUser.role.RoleName === 'RootAdmin');

export const selectRole = createSelector(
  selectAuth, 
  state => state.authUser.role);

export const selectAccountId = createSelector(
  selectAuth,
  (state) => state.authUser.accountId);
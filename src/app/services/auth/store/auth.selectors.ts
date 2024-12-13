import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthState, AuthPartialState, AUTH_FEATURE_KEY } from './auth.models';

export const selectAuth = (state: AuthPartialState) => state.auth;

export const selectState = createSelector(selectAuth, (state) => state);

export const selectIsSignedIn = createSelector(selectAuth, (state) => state.isSignedIn);

export const selectLoginError = createSelector(selectAuth, (state) => state.hasLoginError);

export const selectIsLoadingLogin = createSelector(selectAuth, (state) => state.isLoadingLogin);

export const selectIsAdmin = createSelector(
    selectAuth,
    (state) => state.authUser.role === 'Administrator');
    
export const selectRole = createSelector(
    selectAuth, 
    state => state.authUser.role);
import { Action, createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { SignInActions, RefreshTokenActions, GetAuthUserActions } from './auth.actions';
import { AuthState, TokenStatus, AuthUser, AUTH_FEATURE_KEY } from './auth.models';

export const initialState: AuthState = {
  isSignedIn: false,
  authUser: {
    id: null,
    accountId: null,
    userName: null,
    email: null,
    role: '',
  },
  accessTokenStatus: TokenStatus.PENDING,
  refreshTokenStatus: TokenStatus.PENDING,
  isLoadingLogin: false,
  hasLoginError: false,
};

export const authReducer = createReducer(
  initialState,

  // Sign In
  on(
    SignInActions.request,
    (state): AuthState => ({
      ...state,
      isSignedIn: true,
      accessTokenStatus: TokenStatus.VALIDATING,
      isLoadingLogin: true,
      hasLoginError: false,
    })
  ),

  // Refresh token
  on(
    RefreshTokenActions.request,
    (state): AuthState => ({
      ...state,
      refreshTokenStatus: TokenStatus.VALIDATING,
    })
  ),

  // Sign In & Refresh token
  on(
    SignInActions.success,
    RefreshTokenActions.success,
    (state): AuthState => ({
      ...state,
      isSignedIn: true,
      isLoadingLogin: false,
      accessTokenStatus: TokenStatus.VALID,
      refreshTokenStatus: TokenStatus.VALID,
    })
  ),
  on(
    SignInActions.failure,
    RefreshTokenActions.failure,
    (state, action): AuthState => ({
      ...state,
      isLoadingLogin: false,
      accessTokenStatus: TokenStatus.INVALID,
      refreshTokenStatus: TokenStatus.INVALID,
      hasLoginError: action.type === SignInActions.failure.type && !!action.error,
    })
  ),

  // Sign Out
  on(
    AuthActions.signOut,
    (): AuthState => ({
      ...initialState,
    })
  ),

  // Auth user
  on(
    GetAuthUserActions.success,
    (state, action): AuthState => ({
      ...state,
      authUser: action.user,
    })
  ),
  on(
    GetAuthUserActions.failure,
    (): AuthState => ({
      ...initialState,
    })
  )
);
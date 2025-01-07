import { Action, createReducer, on } from '@ngrx/store';

import { SignInActions, RefreshTokenActions, SignOutActions  } from './auth.actions';
import { AuthState, TokenStatus, AuthUser } from './auth.models';
import { AUTH_FEATURE_KEY } from './auth.selectors';

export const initialState: AuthState = {
  isSignedIn: false,
  authUser: {
    id: null,
    accountId: null,
    firstName: '',
    lastName: '',
    email: '',
    role: {
      RoleId: '',
      RoleName: ''
    },
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
      isSignedIn: false,
      accessTokenStatus: TokenStatus.VALIDATING,
      isLoadingLogin: true,
      hasLoginError: false,
    })
  ),
  on(
    SignInActions.success,
    (state, action): AuthState => ({
      ...state,
      isSignedIn: true,
      isLoadingLogin: false,
      accessTokenStatus: TokenStatus.VALID,
      refreshTokenStatus: TokenStatus.VALID,
      authUser: action.user,
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
    SignOutActions.request,
    (): AuthState => ({
      ...initialState,
    })
  ),
);
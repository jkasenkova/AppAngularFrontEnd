import { Guid } from "guid-typescript";

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthPartialState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

export enum TokenStatus {
    PENDING = 'PENDING',
    VALIDATING = 'VALIDATING',
    VALID = 'VALID',
    INVALID = 'INVALID',
  }
  
export interface AuthState {
  isSignedIn: boolean;
  accessTokenStatus: TokenStatus;
  refreshTokenStatus: TokenStatus;
  isLoadingLogin: boolean;
  hasLoginError: boolean;
  authUser: AuthUser;
}
  
export interface AuthUser {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}
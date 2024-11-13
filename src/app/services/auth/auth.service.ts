import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_INITIALIZER, Injectable, Provider, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { lastValueFrom, Observable, of, throwError, from } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { TokenStorageService } from './token/token-storage.service';
import { ConfigService } from './token/config.service';
import { RefreshTokenActions } from '../auth/store/auth.actions';
import { AuthState, AuthUser, TokenStatus, AuthPartialState } from '../auth/store/auth.models';
import * as AuthSelectors from '../auth/store/auth.selectors';
import { Subscription } from 'src/app/models/subscription';
import { AuthFacade } from './store/auth.facade';
import { JWTTokenService } from './token/jwt-token.service';
import { Guid } from 'guid-typescript';

export interface AccessData {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  scope: string;
}

export interface SignUpData {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  position: string;
  officeLocation: string;
  timeZoneControl: string;
  password: string;
  passwordConfirm: string;
}

export interface SignUpResponse {
  error: string;
  companyId: Guid;
  companyName: string;
  succeeded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(
    private readonly store: Store<AuthPartialState>,
    private readonly http: HttpClient,
    private readonly configService: ConfigService,
    private readonly authFacade: AuthFacade,
    private readonly tokenStorageService: TokenStorageService,
    private readonly jwtTokenService: JWTTokenService,
  ) {}

  private readonly hostUrl = this.configService.getAPIUrl();
  private readonly clientId = this.configService.getAuthSettings().clientId;
  private readonly scope = this.configService.getAuthSettings().scope;
  private readonly clientSecret = this.configService.getAuthSettings().secretId;
  
  /**
   * Returns a promise that waits until
   * refresh token and get auth user
   *
   * @returns {Promise<AuthState>}
   */
  init(): Promise<AuthState> {
    this.store.dispatch(RefreshTokenActions.request());

    const defaultAuthState: AuthState = {
      isSignedIn: false,
      isLoadingLogin: true,
      hasLoginError: false,
      refreshTokenStatus: TokenStatus.INVALID,
      accessTokenStatus: TokenStatus.INVALID,
      authUser: null,
    };

    const authState$ = this.store.select(AuthSelectors.selectAuth).pipe(
      filter(
        auth =>
          auth &&
          (auth.refreshTokenStatus === TokenStatus.INVALID ||
          (auth.refreshTokenStatus === TokenStatus.VALID && !!auth.authUser))
      ),
      take(1)
    );

    if(authState$.subscribe) {
      return lastValueFrom(authState$);
    } else {
      return lastValueFrom(of(defaultAuthState));
    }
  }

  /**
   * Performs a request with user credentials
   * in order to get auth tokens
   *
   * @param {string} username
   * @param {string} password
   * @returns Observable<AccessData>
   */
  signIn(username: string, password: string): Observable<AccessData> {
    const payload = new HttpParams()
    .set('client_id', this.clientId)
    .set('grant_type', 'password')
    .set('username', username)
    .set('password', password);

    return this.http.post<AccessData>(`${this.hostUrl}/connect/token`, payload.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': '*/*',
        'Cache-control': 'no-cache',
      }
    });
  }

  signUp(signUpData: SignUpData): Observable<SignUpResponse> {
    let body = JSON.stringify(signUpData);
    return this.http.post<SignUpResponse>(`${this.hostUrl}/api/Accounts/sing-up`, body,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  /**
   * Performs a request for logout authenticated user
   *
   * @param {('all' | 'allButCurrent' | 'current')} [clients='current']
   * @returns Observable<void>
   */
  logout(clients: 'all' | 'allButCurrent' | 'current' = 'current'): Observable<void> {
    const params = new HttpParams().append('clients', clients);

    return this.http.post<void>(`${this.hostUrl}/api/accounts/sign-up`, { params });
  }

  /**
   * Asks for a new access token given
   * the stored refresh token
   *
   * @returns {Observable<AccessData>}
   */
  refreshToken(): Observable<AccessData> {
    const refreshToken = this.tokenStorageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token does not exist'));
    }

    return this.http.post<AccessData>(`${this.hostUrl}/api/auth/login`, {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
  }

  /**
   * Returns authenticated user
   * based on saved access token
   *
   * @returns {Observable<AuthUser>}
   */
  getAuthUser(): Observable<AuthUser> {

    const authUser: AuthUser = {
      id: this.jwtTokenService.getUserId(),
      accountId: this.jwtTokenService.getAccountId(),
      role: this.jwtTokenService.getRole(),
      userName: this.jwtTokenService.getUserName(),
      email: this.jwtTokenService.getEmail(),
    };
    return of(authUser);
  }

  getAccounts(): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(`${this.hostUrl}/api/accounts`);
  }
}

export const authServiceInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (authService: AuthService) => () => authService.init(),
  deps: [AuthService],
  multi: true,
};
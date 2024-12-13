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
import { SignUpResponse } from '../../models/signUpResponse';
import { SignUpData } from '../../models/signUpData';

export interface AccessData {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  scope: string;
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
  private isLoggedIn: boolean;
  
  init(): Promise<AuthState> {
    const token = this.tokenStorageService.getAccessToken();
    this.authFacade.isLoggedIn$.subscribe(value => this.isLoggedIn = value);

    if(this.isLoggedIn && token) {
      this.store.dispatch(RefreshTokenActions.request());

      const authState$ = this.store.select(AuthSelectors.selectAuth).pipe(
        filter(
          auth =>
            auth.refreshTokenStatus === TokenStatus.INVALID ||
            (auth.refreshTokenStatus === TokenStatus.VALID && !!auth.authUser)
        ),
        take(1)
      );

      return lastValueFrom(authState$);
    } else {
      const defaultAuthState: AuthState = {
        isSignedIn: false,
        isLoadingLogin: true,
        hasLoginError: false,
        refreshTokenStatus: TokenStatus.INVALID,
        accessTokenStatus: TokenStatus.INVALID,
        authUser: null,
      };
      return lastValueFrom(of(defaultAuthState)); 
    }
    
  }

  signIn(userEmail: string, password: string): Observable<AccessData> {
    const payload = new HttpParams()
    .set('client_id', this.clientId)
    .set('grant_type', 'password')
    .set('username', userEmail)
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

  login(userEmail: string, password: string): Observable<any> {
    const payload = { email: userEmail, password: password };

    return this.http.post(`${this.hostUrl}/login?useCookies=true&useSessionCookies=true`, payload,
    {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Cache-control': 'no-cache',
      }
    });
  }

  signUp(signUpData: SignUpData): Observable<SignUpResponse> {
    let body = JSON.stringify(signUpData);
    return this.http.post<SignUpResponse>(`${this.hostUrl}/api/accounts/sing-up`, body,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  logout(clients: 'all' | 'allButCurrent' | 'current' = 'current'): Observable<void> {
    const params = new HttpParams().append('clients', clients);

    return this.http.post<void>(`${this.hostUrl}/api/accounts/sign-up`, { params });
  }

  refreshToken(): Observable<AccessData> {
    const refreshToken = this.tokenStorageService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('Refresh token does not exist'));
    }

    return this.http.post<AccessData>(`${this.hostUrl}/refresh`, {
      refresh_token: refreshToken,
    });
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
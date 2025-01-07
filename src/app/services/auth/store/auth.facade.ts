import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SignInActions, SignOutActions } from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { AuthUser, TokenStatus } from './auth.models';
import { AppState } from './auth.selectors';
import { TokenStorageService } from '../token/token-storage.service';
import { JWTTokenService } from '../token/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {

  constructor(
    private store: Store<AppState>,
    private readonly tokenStorage: TokenStorageService,
    private readonly jwtTokenService: JWTTokenService,
  ) {
  }
  
  public readonly state = this.store.select(AuthSelectors.selectState);
  public readonly isLoggedIn$ = this.store.select(AuthSelectors.selectIsSignedIn);
  public readonly isLoadingLogin$ = this.store.select(AuthSelectors.selectIsLoadingLogin);
  public readonly hasLoginError$ = this.store.select(AuthSelectors.selectLoginError);
  public readonly isAdmin$ = this.store.select(AuthSelectors.selectIsAdmin);
  public readonly isRootAdmin$ = this.store.select(AuthSelectors.selectIsRootAdmin);
  public readonly accountId$ = this.store.select(AuthSelectors.selectAccountId);

  signIn(email: string, password: string) {
    this.store.dispatch(SignInActions.request({ email, password }));
  }

  signOut() {
    this.store.dispatch(SignOutActions.request());
  }
}
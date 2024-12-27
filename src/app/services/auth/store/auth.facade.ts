import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { LoginActions, TokenActions } from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { AuthPartialState, AuthUser, TokenStatus } from './auth.models';
import { TokenStorageService } from '../token/token-storage.service';
import { JWTTokenService } from '../token/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {

  constructor(
    private store: Store<AuthPartialState>,
    private readonly tokenStorage: TokenStorageService,
    private readonly jwtTokenService: JWTTokenService,
  ) {
    // const token = this.tokenStorage.getAccessToken();

    // if(token && !this.jwtTokenService.isTokenSet()) {
    //   this.jwtTokenService.setToken(token);
    //   this.jwtTokenService.decodeToken();

    //   const authUser: AuthUser = {
    //     id: this.jwtTokenService.getUserId(),
    //     accountId: this.jwtTokenService.getAccountId(),
    //     role: this.jwtTokenService.getRole(),
    //     firstName: this.jwtTokenService.getFirstName(),
    //     lastName: this.jwtTokenService.getLastName(),
    //     email: this.jwtTokenService.getEmail(),
    //   };
  
    //   this.store.dispatch(TokenActions.request({ user: authUser }));
    // }
  }
  
  public readonly state = this.store.select(AuthSelectors.selectState);
  public readonly isLoggedIn$ = this.store.select(AuthSelectors.selectIsSignedIn);
  public readonly isLoadingLogin$ = this.store.select(AuthSelectors.selectIsLoadingLogin);
  public readonly hasLoginError$ = this.store.select(AuthSelectors.selectLoginError);
  public readonly isAdmin$ = this.store.select(AuthSelectors.selectIsAdmin);

  signIn(email: string, password: string) {
    this.store.dispatch(LoginActions.request({ email, password }));
  }

  signOut() {
    this.store.dispatch(AuthActions.signOut());
  }

  getIsAdmin(){
    return this.store.select(AuthSelectors.selectIsAdmin);
  }
}
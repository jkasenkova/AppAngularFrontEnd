import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import * as AuthActions from './auth.actions';
import { SignInActions, GetAuthUserActions, LoginActions } from './auth.actions';
import * as AuthSelectors from './auth.selectors';
import { AuthState, AuthPartialState } from './auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {

  constructor(
    private store: Store<AuthPartialState>
  ) {}
  
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
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';

import { TokenStorageService } from '../token/token-storage.service';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { SignInActions, RefreshTokenActions, GetAuthUserActions, LoginActions} from './auth.actions';
import { AuthState, AuthUser, TokenStatus, AuthPartialState } from './auth.models';
import { JWTTokenService } from '../token/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthEffects {

  constructor(
    private authService: AuthService,
    private router: Router,
    private actions$: Actions, 
    private tokenStorageService: TokenStorageService,
    private jwtTokenService: JWTTokenService,
    private store: Store<AuthPartialState>
  ){}

  readonly login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.request),
      exhaustMap(credentials => 
        this.authService.login(credentials.email, credentials.password).pipe(
          map(data => {
            return LoginActions.success({ email: credentials.email, password: credentials.password });
          }),
          catchError(error => of(LoginActions.failure({ error })))
        ))
    );
  });

  readonly loginSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.success),
      exhaustMap(data => {
        return of(SignInActions.request({ email: data.email, password: data.password }));
      })
    );
  });

  readonly signIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignInActions.request),
      exhaustMap(credentials =>
        this.authService.signIn(credentials.email, credentials.password).pipe(
          map(data => {
            // save tokens
            this.tokenStorageService.saveTokens(data.access_token, data.access_token);
            this.jwtTokenService.setToken(data.access_token);
            this.jwtTokenService.decodeToken();
            // trigger login success action
            return SignInActions.success();
          }),
          catchError(error => of(SignInActions.failure({ error })))
        )
      )
    );
  });

  readonly onSignInSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignInActions.success),
      exhaustMap(() => {
        const authUser: AuthUser = {
          id: this.jwtTokenService.getUserId(),
          accountId: this.jwtTokenService.getAccountId(),
          role: this.jwtTokenService.getRole(),
          firstName: this.jwtTokenService.getFirstName(),
          lastName: this.jwtTokenService.getLastName(),
          email: this.jwtTokenService.getEmail(),
        };

        return of(GetAuthUserActions.request({ user: authUser }));
      })
    );
  }, { dispatch: true });

  readonly signOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.signOut),
        exhaustMap(() => {
          this.router.navigateByUrl('/');
          return this.authService
            .logout()
            .pipe(finalize(() => {}//this.tokenStorageService.removeTokens()
            ));
        })
      );
    },
    { dispatch: false }
  );

  readonly getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(GetAuthUserActions.request),
      exhaustMap(() => {
        this.jwtTokenService.decodeToken();
        let role = this.jwtTokenService.getRole();
        switch (role) {
          case 'Administrator':
            this.router.navigateByUrl('/my-team');
            break;
          case 'LineManager':
            this.router.navigateByUrl('/my-team');
            break;
          case 'User':
            this.router.navigateByUrl('/my-handover');
            break;
          default:
            this.router.navigateByUrl('/my-handover');
        }
        return of(GetAuthUserActions.success());
      })
    );
  });

  readonly refreshToken$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RefreshTokenActions.request),
      exhaustMap(() =>
        this.authService.refreshToken().pipe(
          map(data => {
            // save tokens
            //this.tokenStorageService.saveTokens(data.access_token, data.refresh_token);
            // trigger refresh token success action
            return RefreshTokenActions.success();
          }),
          catchError(() => of(RefreshTokenActions.failure()))
        )
      )
    );
  });

  readonly onLoginOrRefreshTokenFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SignInActions.failure, RefreshTokenActions.failure),
        tap(() => {
          this.tokenStorageService.removeTokens();
        })
      );
    },
    { dispatch: false }
  );
}
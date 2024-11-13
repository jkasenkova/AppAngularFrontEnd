import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';

import { TokenStorageService } from '../token/token-storage.service';
import { AuthService } from '../auth.service';

import * as AuthActions from './auth.actions';
import { SignInActions, RefreshTokenActions, GetAuthUserActions } from './auth.actions';
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
    private jwtTokenService: JWTTokenService
  ){}

  readonly signIn$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignInActions.request),
      exhaustMap(credentials =>
        this.authService.signIn(credentials.username, credentials.password).pipe(
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
        return this.authService.getAuthUser().pipe(
          map(user => {
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
          })
        );
      })
    );
  }, { dispatch: false });

  readonly signOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AuthActions.signOut),
        exhaustMap(() => {
          this.router.navigateByUrl('/');
          return this.authService
            .logout()
            .pipe(finalize(() => this.tokenStorageService.removeTokens()));
        })
      );
    },
    { dispatch: false }
  );

  readonly getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RefreshTokenActions.success, GetAuthUserActions.request),
      exhaustMap(() =>
        this.authService.getAuthUser().pipe(
          map(user => {
            return GetAuthUserActions.success({ user });
          }),
          catchError(() => of(GetAuthUserActions.failure()))
        )
      )
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
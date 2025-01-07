import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, finalize, map, tap } from 'rxjs/operators';

import { TokenStorageService } from '../token/token-storage.service';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { SignInActions, RefreshTokenActions, SignOutActions } from './auth.actions';
import { AuthState, AuthUser, TokenStatus } from './auth.models';
import { AppState } from './auth.selectors';
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
    private store: Store<AppState>
  ){}

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

            const authUser: AuthUser = {
              id: this.jwtTokenService.getUserId(),
              accountId: this.jwtTokenService.getAccountId(),
              role: this.jwtTokenService.getRole(),
              firstName: this.jwtTokenService.getFirstName(),
              lastName: this.jwtTokenService.getLastName(),
              email: this.jwtTokenService.getEmail(),
            };

            // trigger login success action
            return SignInActions.success({ user: authUser });
          }),
          catchError(error => of(SignInActions.failure({ error })))
        )
      )
    );
  });

  readonly onSignInSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SignInActions.success),
      exhaustMap((data) => {
        switch (data.user.role.RoleName) {
          case 'Administrator':
            this.router.navigateByUrl('/my-team');
            break;
          case 'RootAdmin':
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

        return of(SignInActions.finalize());
      })
    );
  }, { dispatch: true });

  readonly SignOut$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(SignOutActions.request),
        exhaustMap(() => {
          this.tokenStorageService.removeTokens();
          this.router.navigate(['/sign-in']);
          return of(SignOutActions.success());
        })
      );
    },
    { dispatch: false }
  );

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
          this.router.navigate(['/sign-in']);
        })
      );
    },
    { dispatch: false }
  );
}
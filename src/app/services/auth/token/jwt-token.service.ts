import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { AuthRole } from '../store/auth.models';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

    jwtToken: string;
    decodedToken: { [key: string]: string };

    constructor() {
    }

    isTokenSet(): boolean {
      return this.jwtToken ? true : false;
    }

    setToken(token: string) {
      if (token) {
        this.jwtToken = token;
      }
    }

    decodeToken() {
      if (this.jwtToken) {
        this.decodedToken = jwt_decode.jwtDecode(this.jwtToken);
      }
    }

    getDecodeToken() {
      return jwt_decode.jwtDecode(this.jwtToken);
    }

    getExpiryTime() {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken['exp'] : null;
    }

    getRole(): AuthRole {
        this.decodeToken();
        return this.decodedToken ? JSON.parse(this.decodedToken['role']) : null;
    }

    getEmail(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['email'] : null;
    }

    getLastName(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['lastName'] : null;
    }

    getUserId(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['sub'] : null;
    }

    getAccountId(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['accountId'] : null;
    }

    getFirstName(): string {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken['firstName'] : null;
    }

    getTimeZone(): string {
      this.decodeToken();
      return this.decodedToken ? this.decodedToken['timeZone'] : null;
    }

    isTokenExpired(): boolean {
      const expiryTime: number = Number.parseInt(this.getExpiryTime());
      if (expiryTime) {
        return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
      } else {
        return false;
      }
    }
}
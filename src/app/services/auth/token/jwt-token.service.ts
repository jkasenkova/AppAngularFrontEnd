import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {

    jwtToken: string;
    decodedToken: { [key: string]: string };

    constructor() {
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

    getRole(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['role'] : null;
    }

    getEmail(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['email'] : null;
    }

    getUserName(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['userName'] : null;
    }

    getUserId(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['sub'] : null;
    }

    getAccountId(): string {
        this.decodeToken();
        return this.decodedToken ? this.decodedToken['accountId'] : null;
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
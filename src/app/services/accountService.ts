import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Section } from '../models/section';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { AccountModel } from "../models/accountModel";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(private http: HttpClient) {
    }

    url = configurl.apiServer.url + '/accounts';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createAccount(accountModel: AccountModel): Observable<AccountModel> {
        return this.http.post<AccountModel>(this.url, accountModel, this.httpHeaders);
    }
}

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Section } from '../models/section';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { UserModel } from "../models/user";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/userManagment';  //!!!!set correct url
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createUser(userModel: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(this.url, userModel, this.httpHeaders);
    }

    updateUser(userModel: UserModel) {
        this.http.put(this.url, userModel, this.httpHeaders).subscribe();
    }

    deleteUser(userId: Guid): Observable<string> {
        return this.http.delete<string>(this.url + '/' + userId);
    }

    getUser(userId: Guid): Observable<UserModel> {
        return this.http.get<UserModel>(this.url + '/' + userId);
    }

    getUsers(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.url);
    }
}

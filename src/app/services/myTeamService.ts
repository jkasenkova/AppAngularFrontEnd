import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { MyTeamModel } from "../models/myTeamModel";

@Injectable({
    providedIn: 'root'
})
export class MyTeamService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/myTeam';  //!!!!set correct url
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getTeamUser(teamUserId: Guid): Observable<MyTeamModel> {
        return this.http.get<MyTeamModel>(this.url + '/' + teamUserId);
    }

    getTeamUsers(): Observable<MyTeamModel[]> {
        return this.http.get<MyTeamModel[]>(this.url);
    }

    updateTeamUser(myTeamModel: MyTeamModel){
        this.http.put(this.url, myTeamModel, this.httpHeaders).subscribe();
    }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { MyTeamModel } from "../models/myTeamModel";

@Injectable({
    providedIn: 'root'
})
export class MyTeamService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/userManagement'; 
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
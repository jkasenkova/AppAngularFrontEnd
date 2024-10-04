import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { Team } from "../models/team";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/userManagment/team';  //!!!!set correct url
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createTeam(team: Team): Observable<Team> {
        return this.http.post<Team>(this.url, team, this.httpHeaders);
    }

    updateTeam(team: Team) {
        this.http.put(this.url, team, this.httpHeaders).subscribe();
    }

    deleteTeam(teamId: Guid) {
      return this.http.delete(this.url + '/' + teamId);
    }

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.url);
    }

    getTeamById(teamId: Guid): Observable<Team> {
        return this.http.get<Team>(this.url + '/' + teamId);
    }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { Team } from "../models/team";
import { RoleModel } from "../models/role";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/team/'; 
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createTeam(team: Team): Observable<Team> {
        return this.http.post<Team>(this.url, team, this.httpHeaders);
    }

    updateTeam(team: Team) {
        this.http.put(this.url, team, this.httpHeaders).subscribe();
    }

    deleteTeam(teamId: Guid) {
      return this.http.delete(this.url + teamId);
    }

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.url);
    }

    getTeamsByLocationId(locationId: Guid): Observable<Team[]> {
        return this.http.get<Team[]>(this.url + locationId);
    }

    getTeamById(teamId: Guid): Observable<Team> {
        return this.http.get<Team>(this.url + teamId);
    }

    getRolesByTeamId(id: Guid): Observable<RoleModel[]> {
        debugger;
        var res = this.url + id + '/roles';
        return this.http.get<RoleModel[]>(this.url + id + '/roles');
    }
}
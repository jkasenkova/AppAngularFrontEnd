import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { Team } from "../models/team";
import { RoleModel } from "../models/role";

@Injectable({
    providedIn: 'root'
})
export class TeamService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/team'; 
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createTeam(team: Team){
        this.http.post(this.url, team, this.httpHeaders).subscribe();
    }

    updateTeam(team: Team) {
        this.http.patch(this.url, team, this.httpHeaders).subscribe();
    }

    deleteTeam(id: Guid) {
      return this.http.delete(this.url  + '/' + id).subscribe();
    }

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.url);
    }

    getTeamsByLocationId(locationId: Guid): Observable<Team[]> {
        return this.http.get<Team[]>(this.url + locationId);
    }

    getTeamById(teamId: Guid): Observable<Team> {
        return this.http.get<Team>(this.url + '/' + teamId);
    }

    getRolesByTeamId(id: Guid): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.url + '/'+ id + '/roles');
    }
}
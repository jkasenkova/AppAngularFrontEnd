import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
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

    url = this.configService.getRouterUrl() + '/teams'; 
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createTeam(team: Team): Observable<Team> {
        return this.http.post<Team>(this.url, team, this.httpHeaders);
    }

    updateTeam(team: Team): void {
        this.http.patch(this.url, team, this.httpHeaders).subscribe();
    }

    deleteTeam(id: string) {
      return this.http.delete(this.url  + '/' + id).subscribe();
    }

    getTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(this.url);
    }

    getTeamsByLocationId(locationId: string): Observable<Team[]> {
        return this.http.get<Team[]>(this.url + locationId);
    }

    getTeamById(teamId: string): Observable<Team> {
        return this.http.get<Team>(this.url + '/' + teamId);
    }

    getRolesByTeamId(id: string): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.url + '/'+ id + '/roles');
    }
}
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { RoleModel } from "../models/role";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/roles';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createRole(roleModel: RoleModel): Observable<RoleModel> {
        return this.http.post<RoleModel>(this.url, roleModel, this.httpHeaders);
    }

    updateRole(roleModel: RoleModel): void {
        this.http.patch<RoleModel>(this.url, roleModel, this.httpHeaders).subscribe();
    }

    deleteRole(roleId: string) {
        this.http.delete<string>(this.url + '/' + roleId).subscribe();
    }

    getRoleById(id: string): Observable<RoleModel> {
        return this.http.get<RoleModel>(this.url + '/' + id);
    }

    getRolesByTeamId(teamId: string): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.url + '/' + teamId);
    }

    getRoles(): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.url);
    }
}

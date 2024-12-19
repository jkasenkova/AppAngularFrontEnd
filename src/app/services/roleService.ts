import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { RoleModel } from "../models/role";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private baseUrl: string;
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/role';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createRole(roleModel: RoleModel): Observable<RoleModel>{
        return this.http.post<RoleModel>(this.url, roleModel, this.httpHeaders);
    }

    updateRole(roleModel: RoleModel): void {
        this.http.patch(this.url, roleModel, this.httpHeaders).subscribe();
    }

    deleteRole(roleId: Guid) {
        this.http.delete<string>(this.url + '/' + roleId).subscribe();
    }

    getRoleById(id: Guid): Observable<RoleModel> {
        return this.http.get<RoleModel>(this.url + '/' + id);
    }

    getRolesByTeamId(teamId: Guid): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.url + '/' + teamId);
    }

    getRoles(): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(this.url);
    }
}

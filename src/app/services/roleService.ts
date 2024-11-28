import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { RoleModel } from "../models/role";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/role';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createRole(roleModel: RoleModel): void{
        this.http.post<RoleModel>(this.url, roleModel, this.httpHeaders).subscribe({
            next: (response) => {
              console.log('Resource updated successfully:', response);
            },
            error: (err) => {
              console.error('Error updating resource:', err);
            },
        });
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

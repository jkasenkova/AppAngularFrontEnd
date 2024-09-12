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

    url = configurl.apiServer.url + '/userManagment/role';  //!!!!set correct url
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createRole(roleModel: RoleModel): Observable<RoleModel> {
        return this.http.post<RoleModel>(this.url, roleModel, this.httpHeaders);
    }

    updateRole(roleModel: RoleModel) {
        this.http.put(this.url, roleModel, this.httpHeaders).subscribe();
    }

    deleteRole(roleId: Guid): Observable<string> {
        return this.http.delete<string>(this.url + '/' + roleId);
    }

    getRole(roleId: Guid): Observable<RoleModel> {
        return this.http.get<RoleModel>(this.url + '/' + roleId);
    }
}

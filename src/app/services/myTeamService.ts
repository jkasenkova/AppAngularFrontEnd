import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { MyTeamModel } from "../models/myTeamModel";
import { AuthFacade } from './auth/store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class MyTeamService {
    private accountId: string;

    constructor(
        private authFacade: AuthFacade,
        private http: HttpClient,
        private readonly configService: ConfigService) {
        this.authFacade.accountId$.subscribe(data => {
            this.accountId = data;   
        });
    }

    url = this.configService.getRouterUrl() + '/users'; 
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getTeamUser(teamUserId: string): Observable<MyTeamModel> {
        return this.http.get<MyTeamModel>(this.url + '/' + teamUserId);
    }

    getTeamUsers(companyId?: string): Observable<MyTeamModel[]> {
        if(!companyId) {
            companyId = this.accountId;
        }
        return this.http.get<MyTeamModel[]>(this.url + '/'+ companyId + '/my-team');
    }

    updateTeamUser(myTeamModel: MyTeamModel){
        this.http.put(this.url, myTeamModel, this.httpHeaders).subscribe();
    }
}
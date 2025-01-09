import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { UserModel } from '@models/user';
import { MyTeamModel } from '@models/myTeamModel';
import { AuthFacade } from './auth/store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class UserService {
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

    createUser(userModel: UserModel): Observable<UserModel> {
        return this.http.post<UserModel>(this.url, userModel, this.httpHeaders);
    }

    updateUser(userModel: UserModel): Observable<UserModel> {
        return this.http.patch<UserModel>(this.url, userModel, this.httpHeaders);
    }

    deleteUser(userId: string): Observable<string> {
        return this.http.delete<string>(this.url + '/' + userId);
    }

    getUser(userId: string): Observable<UserModel> {
        return this.http.get<UserModel>(this.url + '/' + userId);
    }

    getUsers(companyId?: string): Observable<UserModel[]> {
        if(!companyId) {
            companyId = this.accountId;
        }
        return this.http.get<UserModel[]>(this.url + '/'+ companyId + '/company');
    }

    getMyTeamUsers(companyId?: string): Observable<MyTeamModel[]> {
        if(!companyId) {
            companyId = this.accountId;
        }
        return this.http.get<MyTeamModel[]>(this.url + '/'+ companyId + '/my-team');
    }
}

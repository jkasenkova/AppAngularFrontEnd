import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { Team } from '@models/team';
import { Location } from '@models/location';
import { AuthFacade } from './auth/store/auth.facade';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private accountId: string;

    constructor(
        private authFacade: AuthFacade,
        private http: HttpClient,
        private readonly configService: ConfigService) {
        this.authFacade.accountId$.subscribe(data => {
            this.accountId = data;   
        });
    }
 
    url = this.configService.getRouterUrl() + '/locations'; 
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createLocation(locationModel: Location): Observable<Location> {
        if(!locationModel.companyId) {
            locationModel.companyId = this.accountId;
        }
        return this.http.post<Location>(this.url, locationModel, this.httpHeaders);
    }

    updateLocation(locationModel: Location) {
        this.http.patch(this.url, locationModel, this.httpHeaders).subscribe();
    }

    deleteLocation(id: string) {
      return this.http.delete(this.url + '/' + id).subscribe();
    }

    getLocationById(locationId: string): Observable<Location> {
        return this.http.get<Location>(this.url  + '/'+ locationId);
    }

    getLocations(companyId?: string): Observable<Location[]> {
        if(!companyId) {
            companyId = this.accountId;
        }
        return this.http.get<Location[]>(this.url  + '/'+ companyId + '/company');
    }

    getTeamsByLocationId(locationId: string): Observable<Team[]> {
        return this.http.get<Team[]>(this.url  + '/'+ locationId + '/teams?locationId='+ locationId);
    }
}
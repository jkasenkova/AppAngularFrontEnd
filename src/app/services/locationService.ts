import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { Team } from "../models/team";
import { Location } from "../models/location";

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    constructor(private http: HttpClient) {
    }

    url = configurl.apiServer.url + '/locations'; 
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createLocation(locationModel: Location): Observable<Location> {
        return this.http.post<Location>(this.url, locationModel, this.httpHeaders);
    }

    updateLocation(locationModel: Location) {
        this.http.put(this.url, locationModel, this.httpHeaders).subscribe();
    }

    deleteLocation(locationId: Guid) {
      return this.http.delete(this.url + '/' + locationId);
    }

    getLocationById(locationId: Guid): Observable<Location> {
        return this.http.get<Location>(this.url  + '/'+ locationId);
    }

    getLocations(): Observable<Location[]> {
        return this.http.get<Location[]>(this.url);
    }

    getTeamsByLocationId(locationId: Guid): Observable<Team[]> {
        return this.http.get<Team[]>(this.url  + '/'+ locationId + '/teams?locationId='+ locationId);
    }
}
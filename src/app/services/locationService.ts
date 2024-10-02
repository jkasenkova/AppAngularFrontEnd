import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { LocationModel } from "../models/locationModel";

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/userManagment/location';  //!!!!set correct url
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createLocation(locationModel: LocationModel): Observable<LocationModel> {
        return this.http.post<LocationModel>(this.url, locationModel, this.httpHeaders);
    }

    updateLocation(locationModel: LocationModel) {
        this.http.put(this.url, locationModel, this.httpHeaders).subscribe();
    }

    deleteLocation(locationId: Guid) {
      return this.http.delete(this.url + '/' + locationId);
    }

    getLocationById(locationId: Guid): Observable<LocationModel> {
        return this.http.get<LocationModel>(this.url + '/' + locationId);
    }
}
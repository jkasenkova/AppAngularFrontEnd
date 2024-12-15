import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Handover } from '../models/handover';
import { Guid } from 'guid-typescript';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class HandoverService {
    constructor(
        private http: HttpClient, 
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/handover';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getHandovers(): Observable<Handover[]> {
        return this.http.get<Handover[]>(this.url);
    }

    addHandover(handover: Handover): Observable<Handover> {
        return this.http.post<Handover>(this.url, handover, this.httpHeaders);
    }

    updateHandover(handover: Handover): Observable<Handover> {
        return this.http.put<Handover>(this.url, handover, this.httpHeaders);
    }

    deleteHandoverById(id: Guid): Observable<string> {
        return this.http.delete<string>(this.url + '/' + id);
    }

    getHandoverById(id: Guid): Observable<Handover> {
        return this.http.get<Handover>(this.url + '/' + id);
    }
}

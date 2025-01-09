import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Handover } from '../models/handover';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class HandoverService {
    constructor(
        private http: HttpClient, 
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/shiftRotation';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getShifts(): Observable<Handover[]> {
        return this.http.get<Handover[]>(this.url);
    }

    addShift(handover: Handover): Observable<Handover> {
        return this.http.post<Handover>(this.url, handover, this.httpHeaders);
    }

    updateShift(handover: Handover): Observable<Handover> {
        return this.http.patch<Handover>(this.url, handover, this.httpHeaders);
    }

    deleteShiftById(id: string): Observable<string> {
        return this.http.delete<string>(this.url + '/' + id);
    }

    getShiftByOwnerId(id: string): Observable<Handover> {
        return this.http.get<Handover>(this.url + '?ownerId=' + id);
    }

    getShiftById(id: string): Observable<Handover> {
        return this.http.get<Handover>(this.url + '/' + id);
    }
}


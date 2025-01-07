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

    url = this.configService.getRouterUrl() + '/shiftRotation';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getShifts(): Observable<Handover[]> {
        return this.http.get<Handover[]>(this.url);
    }

    addShift(handover: Handover): void {
        this.http.post<Handover>(this.url, handover, this.httpHeaders).subscribe();
    }

    updateShift(handover: Handover): Observable<Handover> {
        return this.http.put<Handover>(this.url, handover, this.httpHeaders);
    }

    deleteShiftById(id: Guid): Observable<string> {
        return this.http.delete<string>(this.url + '/' + id);
    }

    getShiftById(id: Guid): Observable<Handover> {
        return this.http.get<Handover>(this.url + '/' + id);
    }
}


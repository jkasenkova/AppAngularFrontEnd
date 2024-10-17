import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Handover } from '../models/handover';

@Injectable({
    providedIn: 'root'
})
export class HandoverService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = environment.routerUrl + '/template';
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

    deleteHandoverById(id: string): Observable<string> {
        return this.http.delete<string>(this.url + '/' + id);
    }

    getHandoverById(id: string): Observable<Handover> {
        return this.http.get<Handover>(this.url + '/' + id);
    }
}

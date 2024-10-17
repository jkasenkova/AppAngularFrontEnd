import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { HandoverSection } from "../models/handoverSection";

@Injectable({
    providedIn: 'root'
})
export class HandoverSectionService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/section';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createSection(section: HandoverSection): Observable<HandoverSection> {
        return this.http.post<HandoverSection>(this.url, section, this.httpHeaders);
    }

    updateSection(section: HandoverSection) {
        this.http.put(this.url, section, this.httpHeaders).subscribe();
    }

    deleteSection(sectionId: Guid): Observable<string> {
        return this.http.delete<string>(this.url + '/' + sectionId);
    }

    getSections(templateId: Guid): Observable<HandoverSection[]> {
        return this.http.get<HandoverSection[]>(this.url + '/' + templateId);
    }
}

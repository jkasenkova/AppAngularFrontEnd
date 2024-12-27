import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";
import { HandoverSection } from "../models/handoverSection";

@Injectable({
    providedIn: 'root'
})
export class HandoverSectionService {
    constructor(
        private http: HttpClient, 
        private readonly configService: ConfigService) {
    }

    private readonly url = this.configService.getRouterUrl() + '/section';
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

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Section } from '../models/section';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SectionService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/section';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createSection(section: Section): Observable<Section> {
        return this.http.post<Section>(this.url, section, this.httpHeaders);
    }

    updateSection(section: Section) {
        this.http.patch<Section>(this.url, section, this.httpHeaders).subscribe();
    }

    deleteSection(id: string) {
        this.http.delete(this.url + '/' + id).subscribe();
    }

    getSections(templateId: string): Observable<Section[]> {
        return this.http.get<Section[]>(this.url + '/' + templateId + '/sections');
    }

    getSectionById(id: string): Observable<Section> {
        debugger;
        return this.http.get<Section>(this.url + '/' + id);
    }
}

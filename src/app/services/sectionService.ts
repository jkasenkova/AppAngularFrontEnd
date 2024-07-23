import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Section } from '../models/section';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SectionService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/section';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createSection(section: Section): Observable<Section> {
        return this.http.post<Section>(this.url, section, this.httpHeaders);
    }

    updateSection(section: Section) {
        this.http.put(this.url, section, this.httpHeaders).subscribe();
    }

    deleteSection(sectionId: string): Observable<string> {
        return this.http.delete<string>(this.url + '/' + sectionId);
    }

    getSections(templateId: string): Observable<Section[]> {
        return this.http.get<Section[]>(this.url + '/' + templateId);
    }
}

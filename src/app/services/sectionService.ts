import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import configurl from '../../assets/config/config.json'
import { Section } from '../models/section';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";

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
        this.http.patch<Section>(this.url, section, this.httpHeaders).subscribe({
            next: (response) => {
                debugger;
              console.log('Resource updated successfully:', response);
            },
            error: (err) => {
                debugger;
              console.error('Error updating resource:', err);
            },
        });
    }

    deleteSection(id: Guid) {
        this.http.delete(this.url + '/' + id).subscribe();
    }

    getSections(templateId: Guid): Observable<Section[]> {
        return this.http.get<Section[]>(this.url + '/' + templateId);
    }
}

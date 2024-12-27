import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Section } from '../models/section';
import { Observable } from "rxjs";
import { Guid } from "guid-typescript";

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

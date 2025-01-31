import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from './config.service';
import { Observable } from "rxjs";
import { RotationSection } from "@models/handoverSection";

@Injectable({
    providedIn: 'root'
})
export class RotationSectionService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/rotationSection';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    createSection(section: RotationSection): Observable<RotationSection> {
        return this.http.post<RotationSection>(this.url, section, this.httpHeaders);
    }

    updateSection(section: RotationSection): Observable<RotationSection> {
        return this.http.patch<RotationSection>(this.url, section, this.httpHeaders);
    }

    deleteSection(id: string) {
        this.http.delete(this.url + '/' + id).subscribe();
    }

    getSections(id: string): Observable<RotationSection[]> {
        return this.http.get<RotationSection[]>(this.url + '/' + id);
    }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../models/template';
import { Guid } from 'guid-typescript';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/template';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getTemplates(): Observable<Template[]> {
        return this.http.get<Template[]>(this.url);
    }

    addTemplate(template: Template): Observable<Template> {
        return this.http.post<Template>(this.url, template, this.httpHeaders);
    }

    updateTemplate(template: Template): void {
        this.http.patch<Template>(this.url, template, this.httpHeaders).subscribe();
    }

    deleteTemplateById(id: Guid) {
        this.http.delete(this.url + '/' + id).subscribe();
    }

    getTemplateById(id: Guid): Observable<Template> {
        return this.http.get<Template>(this.url + '/' + id);
    }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../models/template';
import { Guid } from 'guid-typescript';
import configurl from '../../assets/config/config.json'

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = configurl.apiServer.url + '/template';
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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Template } from '../models/template';
import { environment } from '../../environments/environment';
import { Guid } from 'guid-typescript';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = environment.routerUrl + '/template';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getTemplates(): Observable<Template[]> {
        return this.http.get<Template[]>(this.url);
    }

    addTemplate(template: Template): Observable<Template> {
        return this.http.post<Template>(this.url, template, this.httpHeaders);
    }

    updateTemplate(template: Template): Observable<Template> {
        return this.http.put<Template>(this.url, template, this.httpHeaders);
    }

    deleteTemplateById(id: Guid): Observable<string> {
        return this.http.delete<string>(this.url + '/' + id);
    }

    getTemplateById(id: Guid): Observable<Template> {
        return this.http.get<Template>(this.url + '/' + id);
    }
}

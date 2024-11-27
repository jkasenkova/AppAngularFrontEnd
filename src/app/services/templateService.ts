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

    addTemplate(template: Template) {
        this.http.post<Template>(this.url, template, this.httpHeaders).subscribe({
            next: (response) => {
              console.log('Resource updated successfully:', response);
            },
            error: (err) => {
              console.error('Error updating resource:', err);
            },
        });
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

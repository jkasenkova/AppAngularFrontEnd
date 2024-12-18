import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateTopic } from '../models/templateTopic';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TemplateTopicService {
  
  constructor(private http: HttpClient,
    private readonly configService: ConfigService
  ) { }

  url = this.configService.getRouterUrl() + '/templateTopic';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

  getTemplateTopicsBySectionId(sectionId?: Guid): Observable<TemplateTopic[]> {
    return this.http.get<TemplateTopic[]>(this.url + '/' + sectionId + '/topics');
  }

  getTemplateTopics(): Observable<TemplateTopic[]> {
    return this.http.get<TemplateTopic[]>(this.url);
  }

  addTemplateTopic(topic: TemplateTopic): Observable<TemplateTopic> {
    return this.http.post<TemplateTopic>(this.url, topic, this.httpHeaders);
  }

  updateTopic(topic: TemplateTopic): void {
     this.http.patch(this.url, topic, this.httpHeaders).subscribe();
  }

  deleteTemplateTopicById(id: string): void {
    this.http.delete<string>(this.url + '/' + id).subscribe();
  }

  updateOrderTopics(topics: TemplateTopic[]): void{
    this.http.post(this.url + '/updateOrder', topics, this.httpHeaders).subscribe();
  }

  getTemplateTopicById(id: Guid): Observable<TemplateTopic> {
    return this.http.get<TemplateTopic>(this.url + '/' + id);
  }
}

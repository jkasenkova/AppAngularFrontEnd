import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateTopic } from '../models/templateTopic';
import configurl from '../../assets/config/config.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reference } from '../models/reference';
import { AddTopic } from '../models/addTopic';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class TemplateTopicService {

  url = configurl.apiServer.url + '/templateTopic';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
  constructor(private http: HttpClient) { }

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

  deleteTemplateTopicById(id: string): Observable<string> {
    return this.http.delete<string>(this.url + '/' + id);
  }

  updateOrderTopics(topics: TemplateTopic[]): void{
    this.http.post(this.url + '/updateOrder', topics, this.httpHeaders).subscribe();
  }
}

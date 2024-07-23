import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TemplateTopic } from '../models/templateTopic';
import configurl from '../../assets/config/config.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reference } from '../models/reference';
import { AddTopic } from '../models/addTopic';

@Injectable({
  providedIn: 'root'
})
export class TopicService {

  url = configurl.apiServer.url + '/topic';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
  constructor(private http: HttpClient) { }

  getTemplateTopicList(): Observable<TemplateTopic[]> {
    return this.http.get<TemplateTopic[]>(this.url);
  }

  getReferenceList(): Observable<Reference[]> {
    return this.http.get<Reference[]>(this.url + '/getAllReferences');
  }

  addTemplateTopic(topic: TemplateTopic): Observable<TemplateTopic> {
    return this.http.post<TemplateTopic>(this.url, topic, this.httpHeaders);
  }

  addNewTopicReference(topic: AddTopic): Observable<TemplateTopic> {
    return this.http.post<TemplateTopic>(this.url + '/addNewTopicReference', topic, this.httpHeaders);
  }

  updateTopic(topic: TemplateTopic): Observable<TemplateTopic> {
    return this.http.post<TemplateTopic>(this.url + '/updateTopic', topic, this.httpHeaders);
  }

  deleteTemplateTopicById(id: string): Observable<string> {
    return this.http.delete<string>(this.url + '/' + id);
  }

  getTopicsBySectionId(id: string): Observable<TemplateTopic[]> {
    return this.http.get<TemplateTopic[]>(this.url + '/getTopicsBySectionId/' + id);
  }

  getTemplateTopicById(id: string): Observable<TemplateTopic> {
    return this.http.get<TemplateTopic>(this.url + '/getTopic/' + id);
  }

  getReferenceById(id: string): Observable<Reference> {
    return this.http.get<Reference>(this.url + '/getReferenceById/' + id);
  }

  updateReference(reference: Reference): Observable<Reference> {
    return this.http.post<Reference>(this.url + '/updateReference', reference, this.httpHeaders);
  }

  addReference(reference: Reference): Observable<Reference> {
    return this.http.post<Reference>(this.url + '/addReference', reference, this.httpHeaders);
  }

  getAllReferencesByTopic(topicId: string): Observable<Reference[]> {
    return this.http.get<Reference[]>(this.url + '/getAllReferencesByTopic/' + topicId);
  }

  updateTopics(topics: TemplateTopic[]) {
    this.http.post(this.url + '/updateTopics', topics, this.httpHeaders).subscribe();
  }

  updateReferences(references: Reference[]) {
    this.http.post(this.url + '/updateReferences', references, this.httpHeaders).subscribe();
  }

  updateReferencesByTemplateId(templateId: string): Observable<Reference[]> {
    return this.http.post<Reference[]>(this.url + '/updateReferencesByTemplateId/' + templateId, this.httpHeaders);
  }
}

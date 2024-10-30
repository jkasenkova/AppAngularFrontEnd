import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configurl from '../../assets/config/config.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddTopic } from '../models/addTopic';
import { RotationTopic } from '../models/rotationTopic';
import { RotationReference } from '../models/rotationReference';

@Injectable({
  providedIn: 'root'
})
export class RotationTopicService {

  url = configurl.apiServer.url + '/topic';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
  constructor(private http: HttpClient) { }

  getRotationTopicList(): Observable<RotationTopic[]> {
    return this.http.get<RotationTopic[]>(this.url);
  }

  getReferenceList(): Observable<RotationReference[]> {
    return this.http.get<RotationReference[]>(this.url + '/getAllReferences');
  }

  addRotationTopic(topic: RotationTopic): Observable<RotationTopic> {
    return this.http.post<RotationTopic>(this.url, topic, this.httpHeaders);
  }

  addNewTopicReference(topic: AddTopic): Observable<RotationTopic> {
    return this.http.post<RotationTopic>(this.url + '/addNewTopicReference', topic, this.httpHeaders);
  }

  updateTopic(topic: RotationTopic): Observable<RotationTopic> {
    return this.http.post<RotationTopic>(this.url + '/updateTopic', topic, this.httpHeaders);
  }

  deleteRotationTopicById(id: string): Observable<string> {
    return this.http.delete<string>(this.url + '/' + id);
  }

  getTopicsBySectionId(id: string): Observable<RotationTopic[]> {
    return this.http.get<RotationTopic[]>(this.url + '/getTopicsBySectionId/' + id);
  }

  getRotationTopicById(id: string): Observable<RotationTopic> {
    return this.http.get<RotationTopic>(this.url + '/getTopic/' + id);
  }

  getReferenceById(id: string): Observable<RotationReference> {
    return this.http.get<RotationReference>(this.url + '/getReferenceById/' + id);
  }

  updateReference(reference: RotationReference): Observable<RotationReference> {
    return this.http.post<RotationReference>(this.url + '/updateReference', reference, this.httpHeaders);
  }

  addReference(reference: RotationReference): Observable<RotationReference> {
    return this.http.post<RotationReference>(this.url + '/addReference', reference, this.httpHeaders);
  }

  getAllReferencesByTopic(topicId: string): Observable<RotationReference[]> {
    return this.http.get<RotationReference[]>(this.url + '/getAllReferencesByTopic/' + topicId);
  }

  updateTopics(topics: RotationTopic[]) {
    this.http.post(this.url + '/updateTopics', topics, this.httpHeaders).subscribe();
  }

  updateReferences(references: RotationReference[]) {
    this.http.post(this.url + '/updateReferences', references, this.httpHeaders).subscribe();
  }
}

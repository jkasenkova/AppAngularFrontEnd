import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddTopic } from '../models/addTopic';
import { RotationTopic } from '../models/rotationTopic';
import { RotationReference } from '../models/rotationReference';

@Injectable({
  providedIn: 'root'
})
export class RotationTopicService {
  constructor(
    private http: HttpClient,
    private readonly configService: ConfigService) { }

  url = this.configService.getRouterUrl() + '/rotationTopic';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

  getRotations(): Observable<RotationTopic[]> {
    return this.http.get<RotationTopic[]>(this.url);
  }

  addRotationTopic(topic: RotationTopic): Observable<RotationTopic> {
    return this.http.post<RotationTopic>(this.url, topic, this.httpHeaders);
  }

  updateTopic(topic: RotationTopic): Observable<RotationTopic> {
    return this.http.patch<RotationTopic>(this.url, topic, this.httpHeaders);
  }

  deleteRotationTopicById(id: string): Observable<string> {
    return this.http.delete<string>(this.url + '/' + id);
  }

  getTopicsBySectionId(sectionId: string): Observable<RotationTopic[]> {
    return this.http.get<RotationTopic[]>(this.url + '/' + sectionId + '/topics');
  }

}

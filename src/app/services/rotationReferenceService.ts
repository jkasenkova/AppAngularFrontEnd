import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configurl from '../../assets/config/config.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RotationReference } from '../models/rotationReference';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class RotationReferenceService {

  url = configurl.apiServer.url + '/reference';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
  constructor(private http: HttpClient) { }

  getRotationReferences(topicId: Guid): Observable<RotationReference[]> {
    return this.http.get<RotationReference[]>(this.url + '/' + topicId);
  }

  addRotationReference(reference: RotationReference): Observable<RotationReference> {
    return this.http.post<RotationReference>(this.url, reference, this.httpHeaders);
  }

  updateRotationReference(reference: RotationReference): Observable<RotationReference> {
    return this.http.post<RotationReference>(this.url + '/updateReference', reference, this.httpHeaders);
  }

  deleteRotationReferenceById(referenceId: Guid): Observable<string> {
    return this.http.delete<string>(this.url + '/' + referenceId);
  }
}

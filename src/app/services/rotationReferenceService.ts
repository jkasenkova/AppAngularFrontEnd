import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RotationReference } from '../models/rotationReference';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class RotationReferenceService {
  constructor(
    private http: HttpClient,
    private readonly configService: ConfigService) { }

  url = this.configService.getRouterUrl() + '/reference';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

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

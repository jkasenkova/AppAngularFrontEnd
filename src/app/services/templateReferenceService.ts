import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configurl from '../../assets/config/config.json'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { Reference } from '../models/reference';

@Injectable({
  providedIn: 'root'
})
export class TemplateReferenceService {

  url = configurl.apiServer.url + '/templateReference';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
  constructor(private http: HttpClient) { }

  geTemplateReferences(topicId: Guid): Observable<Reference[]> {
    return this.http.get<Reference[]>(this.url + '/' + topicId);
  }

  addTemplateReference(reference: Reference) {
     this.http.post<Reference>(this.url, reference, this.httpHeaders).subscribe();
  }

  updateTemplateReference(reference: Reference) {
     this.http.patch(this.url, reference, this.httpHeaders).subscribe();
  }

  deleteTemplateReferenceById(referenceId: Guid): Observable<string> {
    return this.http.delete<string>(this.url + '/' + referenceId);
  }
}

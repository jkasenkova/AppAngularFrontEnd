import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Guid } from 'guid-typescript';
import { Reference } from '../models/reference';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateReferenceService {

  constructor(
    private http: HttpClient,
    private readonly configService: ConfigService) {
}
  url = this.configService.getRouterUrl()  + '/templateReference';
  httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

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

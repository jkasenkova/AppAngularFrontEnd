import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReportCommentsModel } from '../models/reportCommentsModel';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/handover/comments';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getCommentsByHandoverId(handoverId: string): Observable<ReportCommentsModel[]> {
        return this.http.get<ReportCommentsModel[]>(this.url+ '/' + handoverId);
    }

    addComment(comment: ReportCommentsModel): Observable<ReportCommentsModel> {
        return this.http.post<ReportCommentsModel>(this.url, comment, this.httpHeaders);
    }

    updateComment(comment: ReportCommentsModel): Observable<ReportCommentsModel> {
        return this.http.put<ReportCommentsModel>(this.url, comment, this.httpHeaders);
    }

    deleteCommentById(id: string): Observable<string> {
        return this.http.delete<string>(this.url + '/' + id);
    }

    getCommentById(id: string): Observable<ReportCommentsModel> {
        return this.http.get<ReportCommentsModel>(this.url + '/' + id);
    }
}

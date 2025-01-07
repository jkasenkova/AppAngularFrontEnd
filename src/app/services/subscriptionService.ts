import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Subscription } from "../models/subscription";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: 'root'
  })
  export class SubscriptionService {
    constructor(
        private http: HttpClient,
        private readonly configService: ConfigService) {
    }

    url = this.configService.getRouterUrl() + '/subscription';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getSubscriptions(): Observable<Subscription[]> {
        return this.http.get<Subscription[]>(this.url);
    }

    getSubscriptionById(id: string): Observable<Subscription> {
        return this.http.get<Subscription>(this.url + '/' + id);
    }

    updateSubscription(subscription: Subscription): Observable<Subscription> {
        return this.http.put<Subscription>(this.url, subscription, this.httpHeaders);
    }
}
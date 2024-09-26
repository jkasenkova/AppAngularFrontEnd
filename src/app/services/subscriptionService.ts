import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Subscription } from "../models/subscription";
import { Guid } from "guid-typescript";

@Injectable({
    providedIn: 'root'
  })
  export class SubscriptionService {
    private baseUrl: string;
    constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    url = environment.routerUrl + '/subscription';
    httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    getSubscriptions(): Observable<Subscription[]> {
        return this.http.get<Subscription[]>(this.url);
    }

    getSubscriptionById(id: Guid): Observable<Subscription> {
        return this.http.get<Subscription>(this.url + '/' + id);
    }

    updateSubscription(subscription: Subscription): Observable<Subscription> {
        return this.http.put<Subscription>(this.url, subscription, this.httpHeaders);
    }
}
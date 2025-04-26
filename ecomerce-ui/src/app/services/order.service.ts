import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}


  createOrder(orderRequest: any): Observable<{ orderId: number }> {
    return this.http.post<{ orderId: number }>(`${environment.apiBaseUrl}/orders`, orderRequest);
  }
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/orders`);
  }
  deleteOrder(orderId: any): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/orders/${orderId}`);
  }
}

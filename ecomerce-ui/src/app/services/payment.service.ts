import { Injectable } from '@angular/core';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private stripe: Stripe | null = null;

  constructor(private http: HttpClient) {}

  // Load Stripe SDK
  async initializeStripe(): Promise<void> {
    this.stripe = await loadStripe('pk_test_51QCAHpBDW3LkkcbKNseYoK0Jq9M1QYKk2rO6QLZQU1CORZzvE82m1yFtr1xKe45yhks7J1m43qcY81yI9Tz8Kx0W00c3SFVQIF');
  }

  // Create Checkout Session
  createCheckoutSession(cartItems: any[],orderId: any): Observable<{ sessionId: string }> {
    const items = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: Math.round(item.price * 100),
      quantity: item.quantity
    }));
    return this.http.post<{ sessionId: string }>(`${environment.apiBaseUrl}/payments/create-checkout-session?orderId=${orderId}`,  items );
  }

  // Redirect to Stripe Checkout
  async redirectToCheckout(sessionId: string): Promise<void> {
    if (!this.stripe) {
      console.error('Stripe is not initialized');
      return;
    }
    const { error } = await this.stripe.redirectToCheckout({ sessionId });
    if (error) {
      console.error('Stripe Checkout Error:', error);
    }
  }
  getPaymentDetails(sessionId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/payments/session-details?session_id=${sessionId}`);
  }
  savePayment(sessionId: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/payments/save-payment?session_id=${sessionId}`, {},{ responseType: 'text' });
  }
  getPayments(): Observable<any> {
    return this.http.get(`${environment.apiBaseUrl}/payments`);
  }

  deletePayment(paymentId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/payments/${paymentId}`);
  }
}

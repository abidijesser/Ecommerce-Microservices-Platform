import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {CurrencyPipe} from '@angular/common';
import {PaymentService} from '../../services/payment.service';
import {OrderService} from '../../services/order.service';
import {KeycloakService} from '../../utils/keycloak/keycloak.service';
import {RouterLink} from '@angular/router';


@Component({
  selector: 'app-panier',
  imports: [
    CurrencyPipe,
    RouterLink
  ],
  templateUrl: './panier.component.html',
  standalone: true,
  styleUrl: './panier.component.css'
})
export class PanierComponent implements OnInit{
  cartItems: any[] = [];


  constructor(private cartService: CartService,private paymentService: PaymentService,private orderService: OrderService,private keyloakService: KeycloakService) {}

  async ngOnInit() {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
    });
    await this.paymentService.initializeStripe();
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clearCart() {
    this.cartService.clearCart();
  }
  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }


  checkout() {
    if (this.cartItems.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    const timestamp = new Date().getTime();
    const userId = this.keyloakService.userId;
    const orderRequest = {

      reference: `MS-${new Date().toISOString().slice(0, 10)}-${timestamp}`,
      amount: this.getTotalPrice(),
      paymentMethod: 'STRIPE',
      customerId: userId, // Replace with real user ID
      products: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };


    this.orderService.createOrder(orderRequest).subscribe(orderResponse => {
      const orderId = orderResponse// ✅ Get generated orderId


      // 🔥 Step 2: Call PaymentService to Create Stripe Checkout Session
      this.paymentService.createCheckoutSession(this.cartItems, orderId)
        .subscribe(paymentResponse => {
          const sessionId = paymentResponse.sessionId;

          // 🔥 Step 3: Redirect to Stripe Checkout
          this.paymentService.redirectToCheckout(sessionId);
        });
    }, error => {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    });
  }

}

import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<any[]>([]);
  cartItems$ = this.cartItems.asObservable();

  constructor() { }
  addToCart(product: any) {
    let currentCart = this.cartItems.getValue();
    let existingProduct = currentCart.find(item => item._id === product._id);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      currentCart.push(product);
    }
    this.cartItems.next([...currentCart]);
  }

  // Remove product from cart
  removeFromCart(productId: number) {
    let currentCart = this.cartItems.getValue().filter(item => item._id !== productId);
    this.cartItems.next([...currentCart]);
  }

  // Clear cart
  clearCart() {
    this.cartItems.next([]);
  }
}

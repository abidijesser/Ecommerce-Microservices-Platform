import {Component, inject, Input} from '@angular/core';
import {CartService} from '../../../services/cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [],
  templateUrl: './product.component.html',
  standalone: true,
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product!: any;
  private _productCover: string | undefined;
  cartService = inject(CartService);
  router = inject(Router);
  get productCover(): string | undefined {
    if (this.product.cover) {
      return 'data:image/jpg;base64,' + this.product.cover
    }
    return 'images/w7.png';
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
    this.router.navigate(['/front/panier']);
  }
}

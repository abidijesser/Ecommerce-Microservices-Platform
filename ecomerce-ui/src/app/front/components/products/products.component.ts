import {Component, OnInit} from '@angular/core';
import {ProductComponent} from '../product/product.component';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-products',
  imports: [
    ProductComponent
  ],
  templateUrl: './products.component.html',
  standalone: true,
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
  products: any[] = [];
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log("products", data);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      }
    });
  }
}

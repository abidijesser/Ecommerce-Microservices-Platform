import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {forkJoin, of, switchMap} from 'rxjs';
declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  imports: [
    CurrencyPipe,
    NgIf,
    FormsModule
  ],
  templateUrl: './product-list.component.html',
  standalone: true,
  styleUrl: './product-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit{
  products = signal<any[]>([]);
  loading = signal(true);
  selectedProductId = signal<string | null>(null);
  isEditing = signal(false);
  editingProductId: string | null = null;
  newProduct: any = {
    name: '',
    description: '',
    price: 0,
    availableQuantity: 0,
    categoryId: '',
    cover: null,
    coverPreview: null
  };
  categories = signal<any[]>([]);



  constructor(private productService: ProductService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();

  }

  openAddModal() {
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
  }

  openDeleteModal(id: string) {
    this.selectedProductId.set(id);
    const modal = new bootstrap.Modal(document.getElementById('deleteProductModal'));
    modal.show();
  }

  confirmDelete() {
    const id = this.selectedProductId();
    if (!id) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.set(this.products().filter(p => p.id !== id));
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteProductModal'));
        modal.hide();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
      }
    });
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newProduct.cover = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.newProduct.coverPreview = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }
  // handleImageUpload(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.newProduct.cover = file;
  //   }
  // }



  // submitAddProduct() {
  //   const productPayload = {
  //     name: this.newProduct.name,
  //     description: this.newProduct.description,
  //     availableQuantity: this.newProduct.availableQuantity,
  //     price: this.newProduct.price,
  //     categoryId: this.newProduct.categoryId
  //   };
  //
  //   this.productService.createProduct(productPayload).pipe(
  //
  //     switchMap((productId: string) => {
  //       const tasks = [];
  //
  //
  //       // Only upload if there's an image
  //       if (this.newProduct.cover) {
  //         tasks.push(this.productService.uploadProductCover(productId, this.newProduct.cover));
  //       }
  //
  //       return tasks.length > 0 ? forkJoin(tasks).pipe(switchMap(() => of(productId))) : of(productId);
  //     })
  //   ).subscribe({
  //     next: (productId) => {
  //       // You might want to reload product or re-fetch, or just push it manually:
  //
  //       const category = this.categories().find(c => c.id === this.newProduct.categoryId);
  //       const categoryName = category ? category.name : '';
  //
  //
  //       const newProductToAdd = {
  //         id: productId,
  //         name: this.newProduct.name,
  //         description: this.newProduct.description,
  //         price: this.newProduct.price,
  //         availableQuantity: this.newProduct.availableQuantity,
  //         categoryId: this.newProduct.categoryId,
  //         categoryName: categoryName,
  //         cover: this.newProduct.coverPreview
  //       };
  //       this.products.update(prev => [...prev, newProductToAdd]);
  //
  //
  //       const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
  //       modal?.hide();
  //       this.resetAddForm();
  //     },
  //     error: (err) => {
  //       console.error('Failed to add product:', err);
  //     }
  //   });
  // }
  submitAddProduct() {
    const productPayload = {
      name: this.newProduct.name,
      description: this.newProduct.description,
      availableQuantity: this.newProduct.availableQuantity,
      price: this.newProduct.price,
      categoryId: this.newProduct.categoryId
    };

    const isEdit = this.isEditing();
    const productId = this.editingProductId;

    const action$ = isEdit
      ? this.productService.updateProduct(productId!, productPayload)
      : this.productService.createProduct(productPayload);

    action$.pipe(
      switchMap((res: any) => {
        const id = isEdit ? productId! : res;
        const tasks = [];

        if (this.newProduct.cover) {
          tasks.push(this.productService.uploadProductCover(id, this.newProduct.cover));
        }

        return tasks.length > 0 ? forkJoin(tasks).pipe(switchMap(() => of(id))) : of(id);
      })
    ).subscribe({
      next: (id) => {
        const category = this.categories().find(c => c.id === this.newProduct.categoryId);
        const categoryName = category ? category.name : '';

        const productData = {
          id,
          name: this.newProduct.name,
          description: this.newProduct.description,
          price: this.newProduct.price,
          availableQuantity: this.newProduct.availableQuantity,
          categoryId: this.newProduct.categoryId,
          categoryName,
          cover: this.newProduct.coverPreview
        };

        if (isEdit) {
          this.products.update((prev) =>
            prev.map(p => p.id === id ? productData : p)
          );
        } else {
          this.products.update(prev => [...prev, productData]);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        modal?.hide();
        this.resetAddForm();
      },
      error: (err) => {
        console.error('Failed to save product:', err);
      }
    });
  }

  resetAddForm() {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      availableQuantity: 0,
      categoryId: '',
      cover: null,
      coverPreview: null
    };
    this.isEditing.set(false);
    this.editingProductId = null;
  }


  editProduct(product: any) {
    this.isEditing.set(true);
    this.editingProductId = product.id;

    this.newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      availableQuantity: product.availableQuantity,
      categoryId: product.categoryId,
      cover: null,
      coverPreview: product.cover // show current image
    };

    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
  }

  private getAllCategories() {
    this.productService.getAllCategories().subscribe({
      next: (res) => {
        this.categories.set(res);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  private getAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        const updated = res.map((product:any )=> ({
          ...product,
          cover: product.cover
            ? 'data:image/jpeg;base64,' + product.cover
            : null
        }));
        this.products.set(updated);
        //this.products.set(res);
        this.loading.set(false);
        console.log(this.products());
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }
}

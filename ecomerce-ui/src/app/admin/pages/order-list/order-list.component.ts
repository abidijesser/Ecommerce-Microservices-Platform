import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {OrderService} from '../../../services/order.service';
import {DecimalPipe, NgClass} from '@angular/common';
declare var bootstrap: any;

@Component({
  selector: 'app-order-list',
  imports: [
    DecimalPipe,
    NgClass
  ],
  templateUrl: './order-list.component.html',
  standalone: true,
  styleUrl: './order-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class OrderListComponent implements OnInit{
  orders = signal<any[]>([]);
  loading = signal(true);
  selectedOrderId = signal<string | null>(null);
constructor(private orderService: OrderService) {
}
  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (res: any[]) => {
       this.orders.set(res);
        this.loading.set(false);
        console.log(this.orders());
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  openDeleteModal(id:any) {
    this.selectedOrderId.set(id);
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')!);
    modal.show();

  }

  confirmDelete() {
    const id = this.selectedOrderId();
    if (!id) return;

    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        // Update local list
        const updatedOrders = this.orders().filter(order => order.id !== id);
        this.orders.set(updatedOrders);

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')!);
        modal?.hide();
      },
      error: (err) => {
        console.error('Error deleting order:', err);
        alert('Error deleting order.');
      }
    });
  }
}

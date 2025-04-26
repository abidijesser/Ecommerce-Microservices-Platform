import {ChangeDetectionStrategy, Component, OnInit, signal} from '@angular/core';
import {PaymentService} from '../../../services/payment.service';
import {CurrencyPipe, DatePipe} from '@angular/common';

declare var bootstrap: any;


@Component({
  selector: 'app-payment-list',
  imports: [
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './payment-list.component.html',
  standalone: true,
  styleUrl: './payment-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PaymentListComponent implements OnInit{
  payments = signal<any[]>([]);
  loading = signal(true);
  selectedPaymentId = signal<number | null>(null);

  constructor(private paymentService: PaymentService) {

  }

  ngOnInit(): void {
    this.fetchPayments();
  }


  private fetchPayments() {
    this.paymentService.getPayments().subscribe({
      next: (res: any[]) => {
        this.payments.set(res);
        this.loading.set(false);
        console.log(this.payments)
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  confirmDelete() {
    const id = this.selectedPaymentId();
    if (!id) return;

    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        // Update local list
        const updatedPayments = this.payments().filter(pay => pay.id !== id);
        this.payments.set(updatedPayments);

        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')!);
        modal?.hide();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        alert('Error deleting user.');
      }
    });

  }

  openDeleteModal(id:number) {
    this.selectedPaymentId.set(id);
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')!);
    modal.show();

  }
}

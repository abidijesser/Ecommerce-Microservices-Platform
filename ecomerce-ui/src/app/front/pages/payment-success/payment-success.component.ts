import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PaymentService} from '../../../services/payment.service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-payment-success',
  imports: [
    CurrencyPipe,

    RouterLink
  ],
  templateUrl: './payment-success.component.html',
  standalone: true,
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit{
  sessionId: string | null = null;
  paymentDetails: any = null;

  constructor(private route: ActivatedRoute, private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (this.sessionId) {
      this.paymentService.getPaymentDetails(this.sessionId).subscribe(response => {
        this.paymentDetails = response;
        this.paymentService.savePayment(this.sessionId).subscribe(() => {
          console.log('Payment successfully saved in database.');
        });
      });
    }
  }

}

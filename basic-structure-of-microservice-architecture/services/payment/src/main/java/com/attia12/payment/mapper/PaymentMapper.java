package com.attia12.payment.mapper;

import com.attia12.payment.model.Payment;
import com.attia12.payment.request.PaymentRequest;
import org.springframework.stereotype.Service;

@Service

public class PaymentMapper {
    public Payment toPayment(PaymentRequest request) {
        if (request == null) {
            return null;
        }
        return Payment.builder()
                .id(request.id())
                .paymentMethod(request.paymentMethod())
                .amount(request.amount())
                .orderId(request.orderId())
                .build();
    }
}

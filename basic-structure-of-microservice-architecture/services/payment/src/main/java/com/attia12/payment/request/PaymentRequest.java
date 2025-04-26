package com.attia12.payment.request;

import com.attia12.payment.customer.Customer;
import com.attia12.payment.model.PaymentMethod;

import java.math.BigDecimal;

public record PaymentRequest(

        Integer id,
        BigDecimal amount,
        PaymentMethod paymentMethod,
        Integer orderId,
        String orderReference,
        Customer customer
) {
}

package com.attia12.payment.service;

import com.attia12.payment.mapper.PaymentMapper;
import com.attia12.payment.model.Payment;
import com.attia12.payment.repository.PaymentRepository;
import com.attia12.payment.request.PaymentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository repository;
    private final PaymentMapper mapper;
    private final StripeService stripeService;


    public Integer createPayment(PaymentRequest request) {
        var payment = this.repository.save(this.mapper.toPayment(request));



        return payment.getId();
    }

    public List<Payment> getAllPayment() {
        return repository.findAll();
    }

    public void deletePayment(Integer paymentId) {
        Optional<Payment> payment = repository.findById(paymentId);
        if (payment.isEmpty()) {
            throw new RuntimeException("Payment not found with ID: " + paymentId);
        }
       repository.deleteById(paymentId);
    }
}

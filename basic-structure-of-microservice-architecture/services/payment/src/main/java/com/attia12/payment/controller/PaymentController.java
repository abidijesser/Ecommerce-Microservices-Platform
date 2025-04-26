package com.attia12.payment.controller;

import com.attia12.payment.model.CheckoutItem;
import com.attia12.payment.model.Payment;
import com.attia12.payment.request.PaymentRequest;
import com.attia12.payment.service.PaymentService;
import com.attia12.payment.service.StripeService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    private final StripeService stripeService;

    @PostMapping("/save-payment")
    public ResponseEntity<String> savePayment(@RequestParam String session_id) {
        stripeService.savePayment(session_id);
        return ResponseEntity.ok("Payment saved successfully!");
    }
    @PostMapping("/create-checkout-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody List<CheckoutItem> items,@RequestParam Integer orderId ) {
        String sessionId = stripeService.createCheckoutSession(items,orderId);
        return ResponseEntity.ok(Collections.singletonMap("sessionId", sessionId));
    }
    @GetMapping("/session-details")
    public ResponseEntity<Map<String, Object>> getSessionDetails(@RequestParam String session_id) {
        try {
            Session session = Session.retrieve(session_id);
            Map<String, Object> response = new HashMap<>();
            response.put("id", session.getId());
            response.put("amount_total", session.getAmountTotal());
            response.put("status", session.getStatus());

            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "Invalid session ID"));
        }
    }
    @GetMapping
    public ResponseEntity<List<Payment>>getAllPayment(){
        return ResponseEntity.ok(paymentService.getAllPayment());

    }
    @DeleteMapping("/{paymentId}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer paymentId) {
        paymentService.deletePayment(paymentId);
        return ResponseEntity.noContent().build();
    }

}

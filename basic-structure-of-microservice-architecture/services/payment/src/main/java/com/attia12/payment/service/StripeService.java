package com.attia12.payment.service;

import com.attia12.payment.model.CheckoutItem;
import com.attia12.payment.model.Payment;
import com.attia12.payment.model.PaymentMethod;
import com.attia12.payment.repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.stripe.model.checkout.Session;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StripeService {
    @Value("${spring.stripe.secret-key}")
    private String secretKey;
    private final PaymentRepository paymentRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createCheckoutSession(List<CheckoutItem> items,Integer orderId) {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (CheckoutItem item : items) {
            lineItems.add(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity((long) item.getQuantity())
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency("usd")
                                            .setUnitAmount(item.getPrice()) // Price in cents
                                            .setProductData(
                                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                            .setName(item.getName())
                                                            .build()
                                            )
                                            .build()
                            )
                            .build()
            );
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:4200/payment-success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:4200/cancel")
                .putMetadata("order_id", String.valueOf(orderId))

                .addAllLineItem(lineItems)
                .build();

        try {
            Session session = Session.create(params);
            return session.getId();
        } catch (StripeException e) {
            throw new RuntimeException("Error creating Stripe session", e);
        }
    }
    public void savePayment(String sessionId) {
        try {
            Session session = Session.retrieve(sessionId);

            Payment payment = Payment.builder()
                    .amount(BigDecimal.valueOf(session.getAmountTotal() / 100.0))
                    .paymentMethod(PaymentMethod.STRIPE)
                    .orderId(Integer.valueOf(session.getMetadata().get("order_id"))) // Store order ID from metadata
                    .build();

            paymentRepository.save(payment);
        } catch (StripeException e) {
            throw new RuntimeException("Error fetching session details from Stripe", e);
        }
    }
}

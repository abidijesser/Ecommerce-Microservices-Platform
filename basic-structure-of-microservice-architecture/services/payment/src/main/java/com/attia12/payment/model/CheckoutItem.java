package com.attia12.payment.model;

import lombok.Data;

@Data
public class CheckoutItem {
    private String id;
    private String name;
    private long price; // Price in cents
    private int quantity;
}

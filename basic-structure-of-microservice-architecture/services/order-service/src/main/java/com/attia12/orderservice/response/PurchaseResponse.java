package com.attia12.orderservice.response;

import java.math.BigDecimal;

public record PurchaseResponse(
        String productId,
        String name,
        String description,
        BigDecimal price,
        double quantity
) {
}

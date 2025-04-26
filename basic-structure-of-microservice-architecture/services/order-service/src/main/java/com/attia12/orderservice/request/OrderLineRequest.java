package com.attia12.orderservice.request;

public record OrderLineRequest( Integer id,
                                Integer orderId,
                                String productId,
                                double quantity) {
}

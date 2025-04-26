package com.attia12.orderservice.mapper;

import com.attia12.orderservice.model.Order;
import com.attia12.orderservice.model.OrderLine;
import com.attia12.orderservice.request.OrderLineRequest;
import com.attia12.orderservice.response.OrderLineResponse;
import org.springframework.stereotype.Service;

@Service

public class OrderLineMapper {
    public OrderLine toOrderLine(OrderLineRequest request) {
        return OrderLine.builder()
                .productId(request.productId())
                .quantity(request.quantity())
                .build();
    }

    public OrderLineResponse toOrderLineResponse(OrderLine orderLine) {
        return new OrderLineResponse(
                orderLine.getId(),
                orderLine.getQuantity()
        );
    }
}

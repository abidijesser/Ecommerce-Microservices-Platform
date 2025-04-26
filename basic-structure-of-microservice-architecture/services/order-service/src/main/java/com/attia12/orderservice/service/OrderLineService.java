package com.attia12.orderservice.service;

import com.attia12.orderservice.mapper.OrderLineMapper;
import com.attia12.orderservice.model.Order;
import com.attia12.orderservice.model.OrderLine;
import com.attia12.orderservice.repository.OrderLineRepository;
import com.attia12.orderservice.repository.OrderRepository;
import com.attia12.orderservice.request.OrderLineRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor

public class OrderLineService {
    private final OrderLineRepository orderLineRepository;
    private final OrderLineMapper orderLineMapper;
    private final OrderRepository orderRepository;


@Transactional
public Integer saveOrderLine(OrderLineRequest orderLineRequest) {

    Order order = orderRepository.findById(orderLineRequest.orderId())
            .orElseThrow(() -> new RuntimeException("Order not found"));


    OrderLine orderLine = orderLineMapper.toOrderLine(orderLineRequest);
    orderLine.setOrder(order);

    return orderLineRepository.save(orderLine).getId();
}
}

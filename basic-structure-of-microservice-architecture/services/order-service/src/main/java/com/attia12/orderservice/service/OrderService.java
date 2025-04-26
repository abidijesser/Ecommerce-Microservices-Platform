package com.attia12.orderservice.service;

import com.attia12.orderservice.mapper.OrderMapper;
import com.attia12.orderservice.product.ProductClient;
import com.attia12.orderservice.repository.OrderRepository;
import com.attia12.orderservice.request.OrderLineRequest;
import com.attia12.orderservice.request.OrderRequest;
import com.attia12.orderservice.request.PurchaseRequest;
import com.attia12.orderservice.response.OrderResponse;
import com.attia12.orderservice.user.CustomerClient;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class OrderService {
    private final CustomerClient customerClient;
    private final ProductClient productClient;
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderLineService orderLineService;
    @Transactional
    public Integer createOrder(OrderRequest request) {

        // check if we have a customer or user --> open feign
        var customer = this.customerClient.getUserById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // purchase the product -> product-microservice  ( rest template)
       this.productClient.purchaseProducts(request.products());
        // persist order
        var order=this.orderRepository.save(orderMapper.toOrder(request));
        System.out.println("Number of products in request: " + request.products().size());
        // persit order lines
        for (PurchaseRequest purchaseRequest : request.products()) {
            // persist order line
            System.out.println("Processing product: " + purchaseRequest.productId() + " Quantity: " + purchaseRequest.quantity());
            orderLineService.saveOrderLine(
                    new OrderLineRequest(null,order.getId(), purchaseRequest.productId(), purchaseRequest.quantity())
            );
        }

        return order.getId();



    }

    public List<OrderResponse> findAllOrders() {
        return this.orderRepository.findAll()
                .stream()
                .map(this.orderMapper::fromOrder)
                .collect(Collectors.toList());
    }

    public OrderResponse findById(Integer orderId) {
        return this.orderRepository.findById(orderId)
                .map(this.orderMapper::fromOrder)
                .orElseThrow(() -> new EntityNotFoundException(String.format("No order found with the provided ID: %d", orderId)));
    }

    @Transactional
    public void deleteOrder(Integer orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new RuntimeException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }
}

package com.attia12.orderservice.controller;

import com.attia12.orderservice.request.OrderRequest;
import com.attia12.orderservice.response.OrderResponse;
import com.attia12.orderservice.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService service;
    @PostMapping
    public ResponseEntity<Integer> createOrder(
            @RequestBody @Valid OrderRequest request
    ) {
        return ResponseEntity.ok(this.service.createOrder(request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> findAll() {
        return ResponseEntity.ok(this.service.findAllOrders());
    }

    @GetMapping("/{order-id}")
    public ResponseEntity<OrderResponse> findById(
            @PathVariable("order-id") Integer orderId
    ) {
        return ResponseEntity.ok(this.service.findById(orderId));
    }
    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }
//    @GetMapping("/test-auth")
//    public ResponseEntity<String> testAuth(Authentication authentication) {
//        if (authentication == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authentication found!");
//        }
//
//        System.out.println("Authentication Object: " + authentication);
//        return ResponseEntity.ok("User Authenticated: " + authentication.getName());
//    }
@DeleteMapping("/{order-id}")
public ResponseEntity<Void> deleteOrder(@PathVariable("order-id") Integer orderId) {
    service.deleteOrder(orderId);
    return ResponseEntity.noContent().build();
}


}

package com.attia12.productservice.controller;

import com.attia12.productservice.model.Category;
import com.attia12.productservice.repository.CategoryRepository;
import com.attia12.productservice.request.ProductPurchaseRequest;
import com.attia12.productservice.request.ProductRequest;
import com.attia12.productservice.response.ProductPurchaseResponse;
import com.attia12.productservice.response.ProductResponse;
import com.attia12.productservice.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService service;
    private final CategoryRepository categoryRepository;

    @PostMapping
    public ResponseEntity<String> createProduct(
            @RequestBody @Valid ProductRequest request
    ) {
        return ResponseEntity.ok(service.createProduct(request));
    }

    @PostMapping("/purchase")
    public ResponseEntity<List<ProductPurchaseResponse>> purchaseProducts(
            @RequestBody List<ProductPurchaseRequest> request
    ) {
        return ResponseEntity.ok(service.purchaseProducts(request));
    }

    @GetMapping("/{product-id}")
    public ResponseEntity<ProductResponse> findById(
            @PathVariable("product-id") String productId
    ) {
        return ResponseEntity.ok(service.findById(productId));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }
    @PostMapping(value = "/cover/{product-id}", consumes = "multipart/form-data")
    public ResponseEntity<?> uploadProductCoverPicture(
            @PathVariable("product-id") String bookId,

            @RequestPart("file") MultipartFile file

    ) {
        service.uploadBookCoverPicture(file, bookId);
        return ResponseEntity.accepted().build();
    }
    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    @DeleteMapping("/{product-id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("product-id") String productId) {
        service.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/{product-id}")
    public ResponseEntity<Void> updateProduct(
            @PathVariable("product-id") String productId,
            @RequestBody @Valid ProductRequest request
    ) {
        service.updateProduct(productId, request);
        return ResponseEntity.noContent().build();
    }
}

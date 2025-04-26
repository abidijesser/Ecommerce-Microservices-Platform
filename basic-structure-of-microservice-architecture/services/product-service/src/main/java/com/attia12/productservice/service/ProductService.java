package com.attia12.productservice.service;

import com.attia12.productservice.exception.ProductNotFoundException;
import com.attia12.productservice.file.FileStorageService;
import com.attia12.productservice.mapper.ProductMapper;
import com.attia12.productservice.model.Category;
import com.attia12.productservice.model.Product;
import com.attia12.productservice.repository.CategoryRepository;
import com.attia12.productservice.repository.ProductRepository;
import com.attia12.productservice.request.ProductPurchaseRequest;
import com.attia12.productservice.request.ProductRequest;
import com.attia12.productservice.response.ProductPurchaseResponse;
import com.attia12.productservice.response.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ProductService {
    private final ProductRepository repository;
    private final ProductMapper mapper;
    private final FileStorageService fileStorageService;
    private final CategoryRepository categoryRepository;
    public String createProduct(ProductRequest request) {
        var product = this.repository.save(mapper.toProduct(request));
        return product.getId();

    }

    public ProductResponse findById(String productId) {
        return repository.findById(productId)
                .map(mapper::toProductResponse)
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID:: " + productId));
    }

    public List<ProductResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional()
    public List<ProductPurchaseResponse> purchaseProducts(
            List<ProductPurchaseRequest> request
    ) {
        var productIds = request
                .stream()
                .map(ProductPurchaseRequest::productId)
                .toList();
        var storedProducts = repository.findAllByIdInOrderById(productIds);
        if (productIds.size() != storedProducts.size()) {
            throw new RuntimeException("One or more products does not exist");
        }
        var sortedRequest = request
                .stream()
                .sorted(Comparator.comparing(ProductPurchaseRequest::productId))
                .toList();
        var purchasedProducts = new ArrayList<ProductPurchaseResponse>();
        for (int i = 0; i < storedProducts.size(); i++) {
            var product = storedProducts.get(i);
            var productRequest = sortedRequest.get(i);
            if (product.getAvailableQuantity() < productRequest.quantity()) {
                throw new RuntimeException("Insufficient stock quantity for product with ID:: " + productRequest.productId());
            }
            var newAvailableQuantity = product.getAvailableQuantity() - productRequest.quantity();
            product.setAvailableQuantity(newAvailableQuantity);
            repository.save(product);
            purchasedProducts.add(mapper.toproductPurchaseResponse(product, productRequest.quantity()));
        }
        return purchasedProducts;
    }

    public void uploadBookCoverPicture(MultipartFile file, String productId) {
        Product product = repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("No product found with ID:: " + productId));

        var profilePicture = fileStorageService.saveFile(file, productId);
        product.setProductCover(profilePicture);
        repository.save(product);
    }

    public void deleteProduct(String productId) {
        repository.deleteById(productId);
    }

    public void updateProduct(String productId, ProductRequest request) {
        Product existingProduct = repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existingProduct.setName(request.name());
        existingProduct.setDescription(request.description());
        existingProduct.setAvailableQuantity(request.availableQuantity());
        existingProduct.setPrice(request.price());
        existingProduct.setCategory(category);

       repository.save(existingProduct);
    }
}

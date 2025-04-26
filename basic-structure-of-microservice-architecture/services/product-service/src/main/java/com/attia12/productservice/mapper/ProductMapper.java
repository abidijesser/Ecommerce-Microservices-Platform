package com.attia12.productservice.mapper;

import com.attia12.productservice.file.FileUtils;
import com.attia12.productservice.model.Category;
import com.attia12.productservice.model.Product;
import com.attia12.productservice.repository.CategoryRepository;
import com.attia12.productservice.request.ProductRequest;
import com.attia12.productservice.response.ProductPurchaseResponse;
import com.attia12.productservice.response.ProductResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor

public class ProductMapper {
    private final CategoryRepository categoryRepository;
    public Product toProduct(ProductRequest request) {
        Category fullCategory = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return Product.builder()
                .id(request.id())
                .name(request.name())
                .description(request.description())
                .availableQuantity(request.availableQuantity())
                .price(request.price())
                .category(fullCategory)
                .build();
    }

    public ProductResponse toProductResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),

                product.getAvailableQuantity(),
                product.getPrice(),
                product.getCategory().getId(),
                product.getCategory().getName(),

                product.getCategory().getDescription(),
                FileUtils.readFileFromLocation(product.getProductCover())
        );
    }

    public ProductPurchaseResponse toproductPurchaseResponse(Product product, double quantity) {
        return new ProductPurchaseResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                quantity
        );
    }
}

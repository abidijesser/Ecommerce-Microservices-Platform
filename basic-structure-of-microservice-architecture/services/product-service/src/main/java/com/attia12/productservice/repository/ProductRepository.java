package com.attia12.productservice.repository;

import com.attia12.productservice.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findAllByIdInOrderById(List<String> ids);
}

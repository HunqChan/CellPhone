package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.dto.CreateProductRequest;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;

public interface ProductService {

    List<Product> getAllProducts();

    List<Product> searchProducts(String keyword);

    List<Product> getProductsByCategoryId(Long categoryId);

    Product createProduct(CreateProductRequest request);

    ProductVariant addVariant(Long productId, ProductVariant variant);
}
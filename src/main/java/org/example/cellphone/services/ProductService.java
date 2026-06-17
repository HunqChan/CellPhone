package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.dto.request.CreateProductRequest;
import org.example.cellphone.dto.request.CreateVariantRequest;
import org.example.cellphone.dto.response.PagedResponse;
import org.example.cellphone.dto.request.ProductSearchRequest;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;

public interface ProductService {

    List<Product> getAllProducts();

    /**
     * Lấy chi tiết sản phẩm theo ID.
     */
    Product getProductById(Long id);

    List<Product> searchProducts(String keyword);

    List<Product> getProductsByCategoryId(Long categoryId);

    Product createProduct(CreateProductRequest request);

    /**
     * Cập nhật thông tin sản phẩm.
     */
    Product updateProduct(Long id, CreateProductRequest request);

    /**
     * Xóa sản phẩm.
     */
    void deleteProduct(Long id);

    ProductVariant addVariant(Long productId, CreateVariantRequest request);

    /**
     * Lọc sản phẩm động theo nhiều tiêu chí kết hợp, có phân trang và sắp xếp.
     */
    PagedResponse<Product> filterProducts(ProductSearchRequest request);
}

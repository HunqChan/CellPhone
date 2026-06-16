package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.CreateProductRequest;
import org.example.cellphone.dto.PagedResponse;
import org.example.cellphone.dto.ProductSearchRequest;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products         -> lấy toàn bộ sản phẩm
    // GET /api/products?search=iphone -> tìm kiếm theo tên
    @GetMapping
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(productService.searchProducts(search));
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // GET /api/products/category/{categoryId} -> lấy sản phẩm theo category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategoryId(categoryId));
    }

    // POST /api/products -> tạo sản phẩm mới kèm categoryId
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    // POST /api/products/1/variants -> thêm biến thể cho sản phẩm id=1
    @PostMapping("/{productId}/variants")
    public ResponseEntity<ProductVariant> addVariant(
            @PathVariable Long productId,
            @RequestBody ProductVariant variant) {
        return ResponseEntity.ok(productService.addVariant(productId, variant));
    }

    /**
     * POST /api/products/search
     * Lọc sản phẩm động kết hợp nhiều tiêu chí: từ khóa, danh mục, hãng,
     * khoảng giá, thuộc tính (màu sắc, dung lượng...), có phân trang và sắp xếp.
     *
     * Request Body ví dụ:
     * {
     *   "search": "iphone",
     *   "brand": "Apple",
     *   "minPrice": 10000000,
     *   "maxPrice": 30000000,
     *   "attributeValueIds": [1, 5],
     *   "page": 0,
     *   "size": 10,
     *   "sortBy": "name",
     *   "sortDir": "asc"
     * }
     */
    @PostMapping("/search")
    public ResponseEntity<PagedResponse<Product>> filterProducts(
            @RequestBody ProductSearchRequest request) {
        return ResponseEntity.ok(productService.filterProducts(request));
    }
}
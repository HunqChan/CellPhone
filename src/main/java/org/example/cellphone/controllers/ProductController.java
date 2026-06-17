package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.CreateProductRequest;
import org.example.cellphone.dto.request.CreateVariantRequest;
import org.example.cellphone.dto.response.PagedResponse;
import org.example.cellphone.dto.request.ProductSearchRequest;
import org.example.cellphone.entities.Product;
import org.example.cellphone.dto.response.ProductResponse;
import org.example.cellphone.dto.response.ProductVariantResponse;
import org.example.cellphone.mapper.ProductMapper;
import org.example.cellphone.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.example.cellphone.dto.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    // GET /api/products         -> lấy toàn bộ sản phẩm
    // GET /api/products?search=iphone -> tìm kiếm theo tên
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProducts(
            @RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) {
            return ResponseEntity.ok(ApiResponse.success(productService.searchProducts(search).stream().map(productMapper::toResponse).toList()));
        }
        return ResponseEntity.ok(ApiResponse.success(productService.getAllProducts().stream().map(productMapper::toResponse).toList()));
    }

    // GET /api/products/{id} -> lấy chi tiết sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                productMapper.toResponse(productService.getProductById(id))));
    }

    // GET /api/products/category/{categoryId} -> lấy sản phẩm theo category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductsByCategoryId(categoryId).stream().map(productMapper::toResponse).toList()));
    }

    // POST /api/products -> tạo sản phẩm mới kèm categoryId
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success(productMapper.toResponse(productService.createProduct(request)), "Tạo sản phẩm thành công"));
    }

    // PUT /api/products/{id} -> cập nhật sản phẩm
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                productMapper.toResponse(productService.updateProduct(id, request)),
                "Cập nhật sản phẩm thành công"));
    }

    // DELETE /api/products/{id} -> xóa sản phẩm
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa sản phẩm id: " + id));
    }

    // POST /api/products/1/variants -> thêm biến thể cho sản phẩm id=1
    @PostMapping("/{productId}/variants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> addVariant(
            @PathVariable Long productId,
            @Valid @RequestBody CreateVariantRequest request) {
        return ResponseEntity.ok(ApiResponse.success(productMapper.toResponse(productService.addVariant(productId, request)), "Thêm biến thể thành công"));
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
    public ResponseEntity<ApiResponse<PagedResponse<ProductResponse>>> filterProducts(
            @Valid @RequestBody ProductSearchRequest request) {
        PagedResponse<Product> result = productService.filterProducts(request);
        PagedResponse<ProductResponse> mapped = new PagedResponse<>(
                result.getContent().stream().map(productMapper::toResponse).toList(),
                result.getPage(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages(),
                result.isLast()
        );
        return ResponseEntity.ok(ApiResponse.success(mapped));
    }
}

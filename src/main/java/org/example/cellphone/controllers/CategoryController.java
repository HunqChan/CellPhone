package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.response.CategoryResponse;
import org.example.cellphone.dto.request.CreateCategoryRequest;
import org.example.cellphone.mapper.CategoryMapper;
import org.example.cellphone.services.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.example.cellphone.dto.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    // GET /api/categories -> lấy tất cả danh mục
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(
                categoryService.getAllCategories().stream()
                        .map(categoryMapper::toResponse).toList()));
    }

    // GET /api/categories/{id} -> lấy chi tiết danh mục
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                categoryMapper.toResponse(categoryService.getCategoryById(id))));
    }

    // POST /api/categories -> tạo danh mục mới
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                categoryMapper.toResponse(categoryService.createCategory(request)),
                "Tạo danh mục thành công"));
    }

    // PUT /api/categories/{id} -> cập nhật danh mục
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CreateCategoryRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                categoryMapper.toResponse(categoryService.updateCategory(id, request)),
                "Cập nhật danh mục thành công"));
    }

    // DELETE /api/categories/{id} -> xóa danh mục
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa danh mục id: " + id));
    }
}

package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.dto.request.CreateCategoryRequest;
import org.example.cellphone.entities.Category;

public interface CategoryService {

    /**
     * Lấy tất cả danh mục.
     */
    List<Category> getAllCategories();

    /**
     * Lấy chi tiết danh mục theo ID.
     */
    Category getCategoryById(Long id);

    /**
     * Tạo danh mục mới.
     */
    Category createCategory(CreateCategoryRequest request);

    /**
     * Cập nhật danh mục.
     */
    Category updateCategory(Long id, CreateCategoryRequest request);

    /**
     * Xóa danh mục.
     */
    void deleteCategory(Long id);
}

package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.entities.Category;

public interface CategoryService {

    List<Category> getAllCategories();

    Category createCategory(Category category);
}

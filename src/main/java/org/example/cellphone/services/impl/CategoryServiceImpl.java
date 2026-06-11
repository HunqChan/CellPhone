package org.example.cellphone.services.impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.entities.Category;
import org.example.cellphone.repositories.CategoryRepository;
import org.example.cellphone.services.CategoryService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }
}

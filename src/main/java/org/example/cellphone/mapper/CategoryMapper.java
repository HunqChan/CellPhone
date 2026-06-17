package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.CategoryResponse;
import org.example.cellphone.entities.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
}

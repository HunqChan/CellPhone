package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.ProductResponse;
import org.example.cellphone.dto.response.ProductVariantResponse;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
public interface ProductMapper {
    ProductResponse toResponse(Product product);
    ProductVariantResponse toResponse(ProductVariant variant);
}

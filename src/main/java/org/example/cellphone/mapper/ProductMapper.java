package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.ProductResponse;
import org.example.cellphone.dto.response.ProductVariantResponse;
import org.example.cellphone.dto.response.AttributeValueResponse;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.entities.AttributeValue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class, AttributeMapper.class})
public interface ProductMapper {
    ProductResponse toResponse(Product product);

    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "productImage", source = "product.image")
    @Mapping(target = "productBrand", source = "product.brand")
    @Mapping(target = "attributes", source = "attributes")
    ProductVariantResponse toResponse(ProductVariant variant);
}

package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.AttributeResponse;
import org.example.cellphone.dto.response.AttributeValueResponse;
import org.example.cellphone.entities.Attribute;
import org.example.cellphone.entities.AttributeValue;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AttributeMapper {
    AttributeResponse toResponse(Attribute attribute);
    AttributeValueResponse toResponse(AttributeValue attributeValue);
}

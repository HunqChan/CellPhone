package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.ProvinceResponse;
import org.example.cellphone.dto.response.WardResponse;
import org.example.cellphone.entities.Province;
import org.example.cellphone.entities.Ward;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    ProvinceResponse toResponse(Province province);
    WardResponse toResponse(Ward ward);
}

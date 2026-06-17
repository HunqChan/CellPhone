package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.AddressResponse;
import org.example.cellphone.entities.Address;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {LocationMapper.class})
public interface AddressMapper {
    AddressResponse toResponse(Address address);
}

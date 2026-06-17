package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.OrderResponse;
import org.example.cellphone.dto.response.OrderItemResponse;
import org.example.cellphone.entities.Order;
import org.example.cellphone.entities.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, AddressMapper.class, ProductMapper.class})
public interface OrderMapper {
    OrderResponse toResponse(Order order);
    OrderItemResponse toResponse(OrderItem orderItem);
}

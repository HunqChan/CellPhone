package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.CartResponse;
import org.example.cellphone.dto.response.CartItemResponse;
import org.example.cellphone.entities.Cart;
import org.example.cellphone.entities.CartItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ProductMapper.class})
public interface CartMapper {
    CartResponse toResponse(Cart cart);
    CartItemResponse toResponse(CartItem cartItem);
}

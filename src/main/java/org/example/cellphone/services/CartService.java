package org.example.cellphone.services;

import org.example.cellphone.dto.request.AddToCartRequest;
import org.example.cellphone.entities.Cart;

public interface CartService {

    Cart getCartByUserId(Long userId);

    Cart addToCart(Long userId, AddToCartRequest request);
}

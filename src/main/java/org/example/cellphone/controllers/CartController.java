package org.example.cellphone.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.AddToCartRequest;
import org.example.cellphone.entities.Cart;
import org.example.cellphone.dto.response.CartResponse;
import org.example.cellphone.mapper.CartMapper;
import org.example.cellphone.services.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.example.cellphone.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;
    private final CartMapper cartMapper;

    // GET /api/cart/1 -> lấy giỏ hàng của user có id=1
    @GetMapping("/{userId}")
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(cartMapper.toResponse(cartService.getCartByUserId(userId))));
    }

    // POST /api/cart/1/add -> thêm sản phẩm vào giỏ hàng của user có id=1
    @PostMapping("/{userId}/add")
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(
            @PathVariable Long userId,
            @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(ApiResponse.success(cartMapper.toResponse(cartService.addToCart(userId, request)), "Thêm vào giỏ hàng thành công"));
    }
}

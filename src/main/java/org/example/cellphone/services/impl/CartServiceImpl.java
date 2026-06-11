package org.example.cellphone.services.impl;

import java.util.ArrayList;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.AddToCartRequest;
import org.example.cellphone.entities.Cart;
import org.example.cellphone.entities.CartItem;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.entities.User;
import org.example.cellphone.repositories.CartRepository;
import org.example.cellphone.repositories.ProductVariantRepository;
import org.example.cellphone.repositories.UserRepository;
import org.example.cellphone.services.CartService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public Cart getCartByUserId(Long userId) {
        // Tìm giỏ hàng theo userId, nếu chưa có thì ném lỗi
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giỏ hàng cho user id: " + userId));
    }

    @Override
    public Cart addToCart(Long userId, AddToCartRequest request) {
        // Bước 1: Kiểm tra User có tồn tại không
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + userId));

        // Bước 2: Kiểm tra ProductVariant có tồn tại không
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể sản phẩm với id: " + request.getProductVariantId()));

        // Bước 3: Tìm Cart của User, nếu chưa có thì tạo Cart mới
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setCartItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });

        // Bước 4: Duyệt qua danh sách CartItem hiện có để kiểm tra ProductVariant đã tồn tại chưa
        CartItem existingItem = null;
        for (CartItem item : cart.getCartItems()) {
            if (item.getProductVariant().getId().equals(request.getProductVariantId())) {
                existingItem = item;
                break;
            }
        }

        if (existingItem != null) {
            // Bước 5a: Nếu ĐÃ CÓ trong giỏ -> cộng thêm số lượng
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            // Bước 5b: Nếu CHƯA CÓ -> tạo CartItem mới và thêm vào giỏ
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProductVariant(variant);
            newItem.setQuantity(request.getQuantity());
            cart.getCartItems().add(newItem);
        }

        // Bước 6: Lưu Cart (cascade ALL sẽ tự động lưu luôn các CartItem bên trong)
        return cartRepository.save(cart);
    }
}

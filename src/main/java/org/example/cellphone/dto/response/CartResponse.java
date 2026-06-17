package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class CartResponse {
    private Long id;
    private UserResponse user;
    private List<CartItemResponse> cartItems;
}

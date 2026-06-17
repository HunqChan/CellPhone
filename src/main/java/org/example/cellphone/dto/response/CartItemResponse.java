package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemResponse {
    private Long id;
    private ProductVariantResponse productVariant;
    private Integer quantity;
}

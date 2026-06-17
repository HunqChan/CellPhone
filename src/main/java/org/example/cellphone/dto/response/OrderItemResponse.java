package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemResponse {
    private Long id;
    private ProductVariantResponse productVariant;
    private Integer quantity;
    private Double price;
}

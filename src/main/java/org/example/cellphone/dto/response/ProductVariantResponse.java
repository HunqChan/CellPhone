package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductVariantResponse {
    private Long id;
    private Double price;
    private Integer quantityInStock;
}

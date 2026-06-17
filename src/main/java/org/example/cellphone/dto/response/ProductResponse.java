package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@Setter
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
    private String brand;
    private CategoryResponse category;
    private List<ProductVariantResponse> variants;
}

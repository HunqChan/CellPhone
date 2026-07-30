package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class ProductVariantResponse {
    private Long id;
    private Double price;
    private Integer quantityInStock;
    // Thêm thông tin sản phẩm để hiển thị ở giỏ hàng & đơn hàng
    private String productName;
    private String productImage;
    private String productBrand;
    private List<AttributeValueResponse> attributes;
}

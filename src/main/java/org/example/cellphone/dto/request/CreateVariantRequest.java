package org.example.cellphone.dto.request;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.Set;

@Getter
@Setter
public class CreateVariantRequest {

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private Double price;

    @NotNull(message = "Số lượng tồn kho không được để trống")
    @Positive(message = "Số lượng phải lớn hơn 0")
    private Integer quantityInStock;

    /**
     * Danh sách ID các AttributeValue gán cho biến thể này.
     * Ví dụ: [1, 5] → Màu đen, 128GB
     */
    private Set<Long> attributeValueIds;
}

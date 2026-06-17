package org.example.cellphone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request body cho các API nhập/xuất kho thủ công của Admin.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryRequest {

    /** ID của biến thể sản phẩm cần điều chỉnh kho */
    private Long productVariantId;

    /** Số lượng nhập thêm hoặc xuất ra (luôn dương) */
    private Integer quantity;
}

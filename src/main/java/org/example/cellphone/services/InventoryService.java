package org.example.cellphone.services;

import org.example.cellphone.dto.request.InventoryRequest;
import org.example.cellphone.entities.ProductVariant;

public interface InventoryService {

    /**
     * [Admin] Nhập kho: Cộng thêm số lượng vào quantityInStock của biến thể.
     *
     * @param request chứa productVariantId và quantity cần nhập
     * @return ProductVariant sau khi cập nhật
     */
    ProductVariant importStock(InventoryRequest request);

    /**
     * [Admin] Xuất kho điều chỉnh: Trừ số lượng khỏi quantityInStock (hàng lỗi, kiểm kê...).
     * Báo lỗi nếu sau khi trừ mà số lượng tồn kho xuống dưới 0.
     *
     * @param request chứa productVariantId và quantity cần xuất
     * @return ProductVariant sau khi cập nhật
     */
    ProductVariant exportStock(InventoryRequest request);
}

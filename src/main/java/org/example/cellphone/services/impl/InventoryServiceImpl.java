package org.example.cellphone.services.impl;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.InventoryRequest;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.repositories.ProductVariantRepository;
import org.example.cellphone.services.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService {

    private final ProductVariantRepository productVariantRepository;

    // ==================== NHẬP KHO ====================

    @Override
    @Transactional
    public ProductVariant importStock(InventoryRequest request) {

        // Validate số lượng
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng nhập phải là số nguyên dương");
        }

        // Tìm biến thể
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy biến thể sản phẩm với id: " + request.getProductVariantId()));

        // Cộng thêm số lượng vào kho
        int newStock = variant.getQuantityInStock() + request.getQuantity();
        variant.setQuantityInStock(newStock);

        return productVariantRepository.save(variant);
    }

    // ==================== XUẤT KHO ĐIỀU CHỈNH ====================

    @Override
    @Transactional
    public ProductVariant exportStock(InventoryRequest request) {

        // Validate số lượng
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new RuntimeException("Số lượng xuất phải là số nguyên dương");
        }

        // Tìm biến thể
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy biến thể sản phẩm với id: " + request.getProductVariantId()));

        // Kiểm tra không được xuất nhiều hơn tồn kho
        int newStock = variant.getQuantityInStock() - request.getQuantity();
        if (newStock < 0) {
            throw new RuntimeException(
                    "Không thể xuất kho: Tồn kho hiện tại là " + variant.getQuantityInStock()
                    + ", số lượng yêu cầu xuất là " + request.getQuantity()
                    + ". Không đủ hàng để xuất."
            );
        }

        variant.setQuantityInStock(newStock);
        return productVariantRepository.save(variant);
    }
}

package org.example.cellphone.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.InventoryRequest;
import org.example.cellphone.dto.response.ProductVariantResponse;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.mapper.ProductMapper;
import org.example.cellphone.services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.example.cellphone.dto.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;
    private final ProductMapper productMapper;

    /**
     * POST /api/inventory/import
     * [Admin] Nhập kho thủ công — cộng thêm số lượng vào tồn kho của biến thể.
     *
     * Request Body:
     * {
     *   "productVariantId": 1,
     *   "quantity": 50
     * }
     */
    @PostMapping("/import")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> importStock(@Valid @RequestBody InventoryRequest request) {
        ProductVariant updated = inventoryService.importStock(request);
        return ResponseEntity.ok(ApiResponse.success(productMapper.toResponse(updated)));
    }

    /**
     * POST /api/inventory/export
     * [Admin] Xuất kho điều chỉnh — trừ số lượng khỏi tồn kho (hàng lỗi, kiểm kê thiếu...).
     * Trả lỗi nếu số lượng tồn kho không đủ để xuất.
     *
     * Request Body:
     * {
     *   "productVariantId": 1,
     *   "quantity": 5
     * }
     */
    @PostMapping("/export")
    public ResponseEntity<ApiResponse<ProductVariantResponse>> exportStock(@Valid @RequestBody InventoryRequest request) {
        ProductVariant updated = inventoryService.exportStock(request);
        return ResponseEntity.ok(ApiResponse.success(productMapper.toResponse(updated)));
    }
}

package org.example.cellphone.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.InventoryRequest;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

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
    public ResponseEntity<?> importStock(@RequestBody InventoryRequest request) {
        try {
            ProductVariant updated = inventoryService.importStock(request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
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
    public ResponseEntity<?> exportStock(@RequestBody InventoryRequest request) {
        try {
            ProductVariant updated = inventoryService.exportStock(request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

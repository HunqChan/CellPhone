package org.example.cellphone.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.response.AttributeResponse;
import org.example.cellphone.dto.response.AttributeValueResponse;
import org.example.cellphone.dto.request.CreateAttributeRequest;
import org.example.cellphone.dto.request.AddAttributeValueRequest;
import org.example.cellphone.mapper.AttributeMapper;
import org.example.cellphone.services.AttributeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.example.cellphone.dto.response.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/attributes")
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeService attributeService;
    private final AttributeMapper attributeMapper;

    // ==================== ATTRIBUTE ====================

    /**
     * GET /api/attributes
     * Lấy toàn bộ danh sách thuộc tính (kèm các giá trị bên trong).
     * Ví dụ: [{ id: 1, name: "Màu sắc", values: [...] }, ...]
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AttributeResponse>>> getAllAttributes() {
        return ResponseEntity.ok(ApiResponse.success(
                attributeService.getAllAttributes().stream()
                        .map(attributeMapper::toResponse).toList()));
    }

    /**
     * GET /api/attributes/{id}
     * Lấy chi tiết một thuộc tính theo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AttributeResponse>> getAttributeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeMapper.toResponse(attributeService.getAttributeById(id))));
    }

    /**
     * POST /api/attributes
     * Tạo thuộc tính mới (ví dụ: "Màu sắc", "Dung lượng", "RAM").
     *
     * Request Body: { "name": "Màu sắc" }
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttributeResponse>> createAttribute(
            @Valid @RequestBody CreateAttributeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeMapper.toResponse(attributeService.createAttribute(request)),
                "Tạo thuộc tính thành công"));
    }

    /**
     * PUT /api/attributes/{id}
     * Cập nhật tên thuộc tính.
     *
     * Request Body: { "name": "Dung lượng" }
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttributeResponse>> updateAttribute(
            @PathVariable Long id,
            @Valid @RequestBody CreateAttributeRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeMapper.toResponse(attributeService.updateAttribute(id, request)),
                "Cập nhật thuộc tính thành công"));
    }

    /**
     * DELETE /api/attributes/{id}
     * Xóa thuộc tính (sẽ cascade xóa luôn các AttributeValue bên trong).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteAttribute(@PathVariable Long id) {
        attributeService.deleteAttribute(id);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa thuộc tính id: " + id));
    }

    // ==================== ATTRIBUTE VALUE ====================

    /**
     * GET /api/attributes/{attributeId}/values
     * Lấy tất cả giá trị của một thuộc tính.
     * Ví dụ: GET /api/attributes/1/values → [{ id: 1, value: "Đen" }, ...]
     */
    @GetMapping("/{attributeId}/values")
    public ResponseEntity<ApiResponse<List<AttributeValueResponse>>> getValuesByAttribute(
            @PathVariable Long attributeId) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeService.getValuesByAttributeId(attributeId).stream()
                        .map(attributeMapper::toResponse).toList()));
    }

    /**
     * POST /api/attributes/{attributeId}/values
     * Thêm giá trị mới vào một thuộc tính.
     * Ví dụ: POST /api/attributes/1/values với body { "value": "Đen" }
     *        → Thêm màu "Đen" vào thuộc tính "Màu sắc"
     */
    @PostMapping("/{attributeId}/values")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttributeValueResponse>> addValue(
            @PathVariable Long attributeId,
            @Valid @RequestBody AddAttributeValueRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeMapper.toResponse(attributeService.addValue(attributeId, request)),
                "Thêm giá trị thành công"));
    }

    /**
     * PUT /api/attributes/values/{valueId}
     * Cập nhật giá trị thuộc tính.
     *
     * Request Body: { "value": "Xanh dương" }
     */
    @PutMapping("/values/{valueId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttributeValueResponse>> updateValue(
            @PathVariable Long valueId,
            @Valid @RequestBody AddAttributeValueRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                attributeMapper.toResponse(attributeService.updateValue(valueId, request)),
                "Cập nhật giá trị thành công"));
    }

    /**
     * DELETE /api/attributes/{attributeId}/values/{valueId}
     * Xóa một giá trị thuộc tính cụ thể.
     * Ví dụ: Xóa màu "Đen" khỏi thuộc tính "Màu sắc"
     */
    @DeleteMapping("/{attributeId}/values/{valueId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> deleteValue(
            @PathVariable Long attributeId,
            @PathVariable Long valueId) {
        attributeService.deleteValue(valueId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa giá trị thuộc tính id: " + valueId));
    }
}

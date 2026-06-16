package org.example.cellphone.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.entities.Attribute;
import org.example.cellphone.entities.AttributeValue;
import org.example.cellphone.repositories.AttributeRepository;
import org.example.cellphone.repositories.AttributeValueRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attributes")
@RequiredArgsConstructor
public class AttributeController {

    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;

    // ==================== ATTRIBUTE ====================

    /**
     * GET /api/attributes
     * Lấy toàn bộ danh sách thuộc tính (kèm các giá trị bên trong).
     * Ví dụ: [{ id: 1, name: "Màu sắc", values: [...] }, ...]
     */
    @GetMapping
    public ResponseEntity<List<Attribute>> getAllAttributes() {
        return ResponseEntity.ok(attributeRepository.findAll());
    }

    /**
     * POST /api/attributes
     * Tạo thuộc tính mới (ví dụ: "Màu sắc", "Dung lượng", "RAM").
     *
     * Request Body: { "name": "Màu sắc" }
     */
    @PostMapping
    public ResponseEntity<?> createAttribute(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Tên thuộc tính không được để trống");
        }
        if (attributeRepository.findByName(name).isPresent()) {
            return ResponseEntity.badRequest().body("Thuộc tính '" + name + "' đã tồn tại");
        }
        Attribute attribute = new Attribute();
        attribute.setName(name);
        return ResponseEntity.ok(attributeRepository.save(attribute));
    }

    /**
     * DELETE /api/attributes/{id}
     * Xóa thuộc tính (sẽ cascade xóa luôn các AttributeValue bên trong).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttribute(@PathVariable Long id) {
        if (!attributeRepository.existsById(id)) {
            return ResponseEntity.badRequest().body("Không tìm thấy thuộc tính với id: " + id);
        }
        attributeRepository.deleteById(id);
        return ResponseEntity.ok("Đã xóa thuộc tính id: " + id);
    }

    // ==================== ATTRIBUTE VALUE ====================

    /**
     * GET /api/attributes/{attributeId}/values
     * Lấy tất cả giá trị của một thuộc tính.
     * Ví dụ: GET /api/attributes/1/values → ["Đen", "Trắng", "Xanh"]
     */
    @GetMapping("/{attributeId}/values")
    public ResponseEntity<?> getValuesByAttribute(@PathVariable Long attributeId) {
        if (!attributeRepository.existsById(attributeId)) {
            return ResponseEntity.badRequest().body("Không tìm thấy thuộc tính với id: " + attributeId);
        }
        return ResponseEntity.ok(attributeValueRepository.findByAttributeId(attributeId));
    }

    /**
     * POST /api/attributes/{attributeId}/values
     * Thêm giá trị mới vào một thuộc tính.
     * Ví dụ: POST /api/attributes/1/values với body { "value": "Đen" }
     *        → Thêm màu "Đen" vào thuộc tính "Màu sắc"
     */
    @PostMapping("/{attributeId}/values")
    public ResponseEntity<?> addValue(
            @PathVariable Long attributeId,
            @RequestBody Map<String, String> body) {

        String value = body.get("value");
        if (value == null || value.isBlank()) {
            return ResponseEntity.badRequest().body("Giá trị không được để trống");
        }

        Attribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy thuộc tính với id: " + attributeId));

        AttributeValue attributeValue = new AttributeValue();
        attributeValue.setValue(value);
        attributeValue.setAttribute(attribute);

        return ResponseEntity.ok(attributeValueRepository.save(attributeValue));
    }

    /**
     * DELETE /api/attributes/{attributeId}/values/{valueId}
     * Xóa một giá trị thuộc tính cụ thể.
     * Ví dụ: Xóa màu "Đen" khỏi thuộc tính "Màu sắc"
     */
    @DeleteMapping("/{attributeId}/values/{valueId}")
    public ResponseEntity<?> deleteValue(
            @PathVariable Long attributeId,
            @PathVariable Long valueId) {
        if (!attributeValueRepository.existsById(valueId)) {
            return ResponseEntity.badRequest().body("Không tìm thấy giá trị thuộc tính với id: " + valueId);
        }
        attributeValueRepository.deleteById(valueId);
        return ResponseEntity.ok("Đã xóa giá trị thuộc tính id: " + valueId);
    }
}

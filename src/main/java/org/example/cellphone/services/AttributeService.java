package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.dto.request.AddAttributeValueRequest;
import org.example.cellphone.dto.request.CreateAttributeRequest;
import org.example.cellphone.entities.Attribute;
import org.example.cellphone.entities.AttributeValue;

public interface AttributeService {

    // ==================== ATTRIBUTE ====================

    /**
     * Lấy toàn bộ danh sách thuộc tính (kèm các giá trị bên trong).
     */
    List<Attribute> getAllAttributes();

    /**
     * Lấy chi tiết một thuộc tính theo ID.
     */
    Attribute getAttributeById(Long id);

    /**
     * Tạo thuộc tính mới (ví dụ: "Màu sắc", "Dung lượng", "RAM").
     * Kiểm tra trùng tên trước khi tạo.
     */
    Attribute createAttribute(CreateAttributeRequest request);

    /**
     * Cập nhật tên thuộc tính.
     */
    Attribute updateAttribute(Long id, CreateAttributeRequest request);

    /**
     * Xóa thuộc tính (cascade xóa luôn các AttributeValue bên trong).
     */
    void deleteAttribute(Long id);

    // ==================== ATTRIBUTE VALUE ====================

    /**
     * Lấy tất cả giá trị của một thuộc tính.
     */
    List<AttributeValue> getValuesByAttributeId(Long attributeId);

    /**
     * Thêm giá trị mới vào một thuộc tính.
     */
    AttributeValue addValue(Long attributeId, AddAttributeValueRequest request);

    /**
     * Cập nhật giá trị thuộc tính.
     */
    AttributeValue updateValue(Long valueId, AddAttributeValueRequest request);

    /**
     * Xóa một giá trị thuộc tính cụ thể.
     */
    void deleteValue(Long valueId);
}

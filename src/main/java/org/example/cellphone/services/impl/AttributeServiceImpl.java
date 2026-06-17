package org.example.cellphone.services.impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.AddAttributeValueRequest;
import org.example.cellphone.dto.request.CreateAttributeRequest;
import org.example.cellphone.entities.Attribute;
import org.example.cellphone.entities.AttributeValue;
import org.example.cellphone.exception.AppException;
import org.example.cellphone.exception.ErrorCode;
import org.example.cellphone.repositories.AttributeRepository;
import org.example.cellphone.repositories.AttributeValueRepository;
import org.example.cellphone.services.AttributeService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AttributeServiceImpl implements AttributeService {

    private final AttributeRepository attributeRepository;
    private final AttributeValueRepository attributeValueRepository;

    // ==================== ATTRIBUTE ====================

    @Override
    public List<Attribute> getAllAttributes() {
        return attributeRepository.findAll();
    }

    @Override
    public Attribute getAttributeById(Long id) {
        return attributeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));
    }

    @Override
    public Attribute createAttribute(CreateAttributeRequest request) {
        // Kiểm tra trùng tên
        if (attributeRepository.findByName(request.getName()).isPresent()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        Attribute attribute = new Attribute();
        attribute.setName(request.getName());
        return attributeRepository.save(attribute);
    }

    @Override
    public Attribute updateAttribute(Long id, CreateAttributeRequest request) {
        // Kiểm tra thuộc tính tồn tại
        Attribute attribute = attributeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        // Kiểm tra trùng tên với thuộc tính khác
        attributeRepository.findByName(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new AppException(ErrorCode.BAD_REQUEST);
            }
        });

        attribute.setName(request.getName());
        return attributeRepository.save(attribute);
    }

    @Override
    public void deleteAttribute(Long id) {
        if (!attributeRepository.existsById(id)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        attributeRepository.deleteById(id);
    }

    // ==================== ATTRIBUTE VALUE ====================

    @Override
    public List<AttributeValue> getValuesByAttributeId(Long attributeId) {
        // Kiểm tra thuộc tính tồn tại
        if (!attributeRepository.existsById(attributeId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        return attributeValueRepository.findByAttributeId(attributeId);
    }

    @Override
    public AttributeValue addValue(Long attributeId, AddAttributeValueRequest request) {
        Attribute attribute = attributeRepository.findById(attributeId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        AttributeValue attributeValue = new AttributeValue();
        attributeValue.setValue(request.getValue());
        attributeValue.setAttribute(attribute);

        return attributeValueRepository.save(attributeValue);
    }

    @Override
    public AttributeValue updateValue(Long valueId, AddAttributeValueRequest request) {
        AttributeValue attributeValue = attributeValueRepository.findById(valueId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND));

        attributeValue.setValue(request.getValue());
        return attributeValueRepository.save(attributeValue);
    }

    @Override
    public void deleteValue(Long valueId) {
        if (!attributeValueRepository.existsById(valueId)) {
            throw new AppException(ErrorCode.NOT_FOUND);
        }
        attributeValueRepository.deleteById(valueId);
    }
}

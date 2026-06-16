package org.example.cellphone.repositories;

import java.util.List;

import org.example.cellphone.entities.AttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AttributeValueRepository extends JpaRepository<AttributeValue, Long> {

    List<AttributeValue> findByAttributeId(Long attributeId);
}

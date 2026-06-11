package org.example.cellphone.repositories;

import java.util.List;

import org.example.cellphone.entities.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WardRepository extends JpaRepository<Ward, Long> {

    List<Ward> findByProvinceId(Long provinceId);
}

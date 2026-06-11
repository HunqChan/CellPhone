package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.entities.Province;
import org.example.cellphone.entities.Ward;

public interface LocationService {

    /**
     * Lấy danh sách tất cả tỉnh/thành phố (cho dropdown).
     */
    List<Province> getAllProvinces();

    /**
     * Lấy danh sách xã/phường theo tỉnh/thành phố (cho dropdown).
     */
    List<Ward> getWardsByProvinceId(Long provinceId);
}

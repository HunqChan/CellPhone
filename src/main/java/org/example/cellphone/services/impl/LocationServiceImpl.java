package org.example.cellphone.services.impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.entities.Province;
import org.example.cellphone.entities.Ward;
import org.example.cellphone.repositories.ProvinceRepository;
import org.example.cellphone.repositories.WardRepository;
import org.example.cellphone.services.LocationService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;

    @Override
    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }

    @Override
    public List<Ward> getWardsByProvinceId(Long provinceId) {
        return wardRepository.findByProvinceId(provinceId);
    }
}

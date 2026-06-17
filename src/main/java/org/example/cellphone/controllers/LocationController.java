package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.entities.Province;
import org.example.cellphone.dto.response.ProvinceResponse;
import org.example.cellphone.dto.response.WardResponse;
import org.example.cellphone.mapper.LocationMapper;
import org.example.cellphone.entities.Ward;
import org.example.cellphone.services.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.example.cellphone.dto.response.ApiResponse;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;
    private final LocationMapper locationMapper;

    /**
     * GET /api/locations/provinces
     * Lấy danh sách tất cả tỉnh/thành phố (cho dropdown).
     */
    @GetMapping("/provinces")
    public ResponseEntity<ApiResponse<List<ProvinceResponse>>> getAllProvinces() {
        return ResponseEntity.ok(ApiResponse.success(locationService.getAllProvinces().stream().map(locationMapper::toResponse).toList()));
    }

    /**
     * GET /api/locations/provinces/{provinceId}/wards
     * Lấy danh sách xã/phường theo tỉnh/thành phố (cho dropdown).
     */
    @GetMapping("/provinces/{provinceId}/wards")
    public ResponseEntity<ApiResponse<List<WardResponse>>> getWardsByProvince(@PathVariable Long provinceId) {
        return ResponseEntity.ok(ApiResponse.success(locationService.getWardsByProvinceId(provinceId).stream().map(locationMapper::toResponse).toList()));
    }
}

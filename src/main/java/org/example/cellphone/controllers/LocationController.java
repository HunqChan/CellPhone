package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.entities.Province;
import org.example.cellphone.entities.Ward;
import org.example.cellphone.services.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    /**
     * GET /api/locations/provinces
     * Lấy danh sách tất cả tỉnh/thành phố (cho dropdown).
     */
    @GetMapping("/provinces")
    public ResponseEntity<List<Province>> getAllProvinces() {
        return ResponseEntity.ok(locationService.getAllProvinces());
    }

    /**
     * GET /api/locations/provinces/{provinceId}/wards
     * Lấy danh sách xã/phường theo tỉnh/thành phố (cho dropdown).
     */
    @GetMapping("/provinces/{provinceId}/wards")
    public ResponseEntity<List<Ward>> getWardsByProvince(@PathVariable Long provinceId) {
        return ResponseEntity.ok(locationService.getWardsByProvinceId(provinceId));
    }
}

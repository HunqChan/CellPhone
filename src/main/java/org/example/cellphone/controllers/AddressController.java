package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.AddressRequest;
import org.example.cellphone.entities.Address;
import org.example.cellphone.dto.response.AddressResponse;
import org.example.cellphone.mapper.AddressMapper;
import org.example.cellphone.services.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.example.cellphone.dto.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class AddressController {

    private final AddressService addressService;
    private final AddressMapper addressMapper;

    /**
     * POST /api/addresses
     * Thêm địa chỉ mới cho User.
     * Request Body: { "userId": 1, "provinceId": 1, "wardId": 5, "detailAddress": "123 Đường ABC", "isDefault": false }
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(@Valid @RequestBody AddressRequest request) {
        Address address = addressService.addAddress(request);
        return ResponseEntity.ok(ApiResponse.success(addressMapper.toResponse(address), "Thêm địa chỉ thành công"));
    }

    /**
     * GET /api/addresses/user/{userId}
     * Lấy danh sách địa chỉ của User.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AddressResponse>>> getAddressesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(addressService.getAddressesByUserId(userId).stream().map(addressMapper::toResponse).toList()));
    }

    /**
     * PUT /api/addresses/{addressId}
     * Cập nhật địa chỉ.
     * Request Body: { "provinceId": 2, "wardId": 10, "detailAddress": "456 Đường XYZ", "isDefault": true }
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            @PathVariable Long addressId,
            @Valid @RequestBody AddressRequest request) {
        Address address = addressService.updateAddress(addressId, request);
        return ResponseEntity.ok(ApiResponse.success(addressMapper.toResponse(address), "Cập nhật địa chỉ thành công"));
    }

    /**
     * DELETE /api/addresses/{addressId}
     * Xóa địa chỉ.
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<ApiResponse<String>> deleteAddress(@PathVariable Long addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok(ApiResponse.success("Đã xóa địa chỉ thành công"));
    }

    /**
     * PUT /api/addresses/{addressId}/default?userId=1
     * Đặt địa chỉ làm mặc định.
     */
    @PutMapping("/{addressId}/default")
    public ResponseEntity<ApiResponse<AddressResponse>> setDefaultAddress(
            @PathVariable Long addressId,
            @RequestParam Long userId) {
        Address address = addressService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok(ApiResponse.success(addressMapper.toResponse(address), "Đã đặt làm địa chỉ mặc định"));
    }
}

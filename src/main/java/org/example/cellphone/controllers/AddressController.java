package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.AddressRequest;
import org.example.cellphone.entities.Address;
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

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    /**
     * POST /api/addresses
     * Thêm địa chỉ mới cho User.
     * Request Body: { "userId": 1, "provinceId": 1, "wardId": 5, "detailAddress": "123 Đường ABC", "isDefault": false }
     */
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody AddressRequest request) {
        try {
            Address address = addressService.addAddress(request);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * GET /api/addresses/user/{userId}
     * Lấy danh sách địa chỉ của User.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }

    /**
     * PUT /api/addresses/{addressId}
     * Cập nhật địa chỉ.
     * Request Body: { "provinceId": 2, "wardId": 10, "detailAddress": "456 Đường XYZ", "isDefault": true }
     */
    @PutMapping("/{addressId}")
    public ResponseEntity<?> updateAddress(
            @PathVariable Long addressId,
            @RequestBody AddressRequest request) {
        try {
            Address address = addressService.updateAddress(addressId, request);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * DELETE /api/addresses/{addressId}
     * Xóa địa chỉ.
     */
    @DeleteMapping("/{addressId}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long addressId) {
        try {
            addressService.deleteAddress(addressId);
            return ResponseEntity.ok("Đã xóa địa chỉ thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT /api/addresses/{addressId}/default?userId=1
     * Đặt địa chỉ làm mặc định.
     */
    @PutMapping("/{addressId}/default")
    public ResponseEntity<?> setDefaultAddress(
            @PathVariable Long addressId,
            @RequestParam Long userId) {
        try {
            Address address = addressService.setDefaultAddress(userId, addressId);
            return ResponseEntity.ok(address);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

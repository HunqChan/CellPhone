package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.dto.request.AddressRequest;
import org.example.cellphone.entities.Address;

public interface AddressService {

    /**
     * Thêm địa chỉ mới cho User.
     * Nếu là địa chỉ đầu tiên → tự động set isDefault = true.
     */
    Address addAddress(AddressRequest request);

    /**
     * Lấy danh sách địa chỉ của User.
     */
    List<Address> getAddressesByUserId(Long userId);

    /**
     * Cập nhật địa chỉ.
     */
    Address updateAddress(Long addressId, AddressRequest request);

    /**
     * Xóa địa chỉ.
     * Nếu xóa địa chỉ default → tự động set địa chỉ khác làm default (nếu còn).
     */
    void deleteAddress(Long addressId);

    /**
     * Đặt một địa chỉ làm mặc định.
     * Reset tất cả địa chỉ khác của user về isDefault = false.
     */
    Address setDefaultAddress(Long userId, Long addressId);
}

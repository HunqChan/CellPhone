package org.example.cellphone.services.impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.AddressRequest;
import org.example.cellphone.entities.Address;
import org.example.cellphone.entities.Province;
import org.example.cellphone.entities.User;
import org.example.cellphone.entities.Ward;
import org.example.cellphone.repositories.AddressRepository;
import org.example.cellphone.repositories.ProvinceRepository;
import org.example.cellphone.repositories.UserRepository;
import org.example.cellphone.repositories.WardRepository;
import org.example.cellphone.services.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProvinceRepository provinceRepository;
    private final WardRepository wardRepository;

    @Override
    @Transactional
    public Address addAddress(AddressRequest request) {

        // Tìm User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy người dùng với id: " + request.getUserId()));

        // Tìm Province
        Province province = provinceRepository.findById(request.getProvinceId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tỉnh/thành phố với id: " + request.getProvinceId()));

        // Tìm Ward
        Ward ward = wardRepository.findById(request.getWardId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy xã/phường với id: " + request.getWardId()));

        // Tạo Address mới
        Address address = new Address();
        address.setUser(user);
        address.setProvince(province);
        address.setWard(ward);
        address.setDetailAddress(request.getDetailAddress());

        // Nếu là địa chỉ đầu tiên → tự động set default
        List<Address> existingAddresses = addressRepository.findByUserId(request.getUserId());
        if (existingAddresses.isEmpty()) {
            address.setIsDefault(true);
        } else {
            address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);

            // Nếu address mới được set default → bỏ default các address khác
            if (Boolean.TRUE.equals(address.getIsDefault())) {
                resetDefaultAddresses(request.getUserId());
            }
        }

        return addressRepository.save(address);
    }

    @Override
    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public Address updateAddress(Long addressId, AddressRequest request) {

        // Tìm Address
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy địa chỉ với id: " + addressId));

        // Cập nhật Province nếu có
        if (request.getProvinceId() != null) {
            Province province = provinceRepository.findById(request.getProvinceId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy tỉnh/thành phố với id: " + request.getProvinceId()));
            address.setProvince(province);
        }

        // Cập nhật Ward nếu có
        if (request.getWardId() != null) {
            Ward ward = wardRepository.findById(request.getWardId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy xã/phường với id: " + request.getWardId()));
            address.setWard(ward);
        }

        // Cập nhật địa chỉ chi tiết nếu có
        if (request.getDetailAddress() != null) {
            address.setDetailAddress(request.getDetailAddress());
        }

        // Cập nhật isDefault nếu có
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            resetDefaultAddresses(address.getUser().getId());
            address.setIsDefault(true);
        }

        return addressRepository.save(address);
    }

    @Override
    @Transactional
    public void deleteAddress(Long addressId) {

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy địa chỉ với id: " + addressId));

        Long userId = address.getUser().getId();
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());

        addressRepository.delete(address);

        // Nếu xóa address đang default → set address khác làm default (nếu còn)
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserId(userId);
            if (!remaining.isEmpty()) {
                remaining.get(0).setIsDefault(true);
                addressRepository.save(remaining.get(0));
            }
        }
    }

    @Override
    @Transactional
    public Address setDefaultAddress(Long userId, Long addressId) {

        // Kiểm tra address thuộc về user
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy địa chỉ với id: " + addressId
                                + " của người dùng id: " + userId));

        // Reset tất cả address khác về false
        resetDefaultAddresses(userId);

        // Set address được chọn là default
        address.setIsDefault(true);
        return addressRepository.save(address);
    }

    /**
     * Helper: Reset tất cả address của user về isDefault = false.
     */
    private void resetDefaultAddresses(Long userId) {
        List<Address> addresses = addressRepository.findByUserId(userId);
        for (Address addr : addresses) {
            if (Boolean.TRUE.equals(addr.getIsDefault())) {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            }
        }
    }
}

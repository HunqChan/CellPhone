package org.example.cellphone.repositories;

import java.util.List;
import java.util.Optional;

import org.example.cellphone.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUserId(Long userId);

    Optional<Address> findByIdAndUserId(Long id, Long userId);
}

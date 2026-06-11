package org.example.cellphone.repositories;

import java.util.List;

import org.example.cellphone.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);

    // Lấy danh sách đơn hàng theo userId, sắp xếp theo ngày đặt mới nhất
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);
}

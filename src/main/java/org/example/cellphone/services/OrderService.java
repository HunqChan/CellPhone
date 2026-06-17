package org.example.cellphone.services;

import java.util.List;

import org.example.cellphone.dto.request.CheckoutRequest;
import org.example.cellphone.entities.Order;

public interface OrderService {

    /**
     * Xử lý đặt hàng (checkout) từ giỏ hàng của User.
     * Kiểm tra tồn kho, trừ kho, tạo đơn hàng, xóa giỏ hàng.
     */
    Order checkout(CheckoutRequest request);

    /**
     * Lấy danh sách đơn hàng theo userId, sắp xếp theo ngày mới nhất.
     */
    List<Order> getOrdersByUserId(Long userId);

    /**
     * Lấy chi tiết một đơn hàng theo orderId.
     */
    Order getOrderById(Long orderId);

    // ==================== CHỨC NĂNG MỚI ====================

    /**
     * [Khách hàng] Hủy đơn hàng.
     * Chỉ cho phép hủy đơn có trạng thái PENDING.
     * Hoàn trả số lượng kho (quantityInStock) cho các ProductVariant liên quan.
     */
    Order cancelOrder(Long orderId);

    /**
     * [Admin] Lấy tất cả đơn hàng trong hệ thống.
     */
    List<Order> getAllOrders();

    /**
     * [Admin] Cập nhật trạng thái đơn hàng.
     * Ví dụ: PENDING -> SHIPPING -> DELIVERED
     */
    Order updateOrderStatus(Long orderId, String status);
}

package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.CheckoutRequest;
import org.example.cellphone.entities.Order;
import org.example.cellphone.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ==================== CHECKOUT ====================

    /**
     * POST /api/orders/checkout
     * Đặt hàng từ giỏ hàng của User.
     * Request Body: { "userId": 1, "addressId": 5 }
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody CheckoutRequest request) {
        try {
            Order order = orderService.checkout(request);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== KHÁCH HÀNG ====================

    /**
     * GET /api/orders/user/{userId}
     * Lấy lịch sử đơn hàng của User (sắp xếp theo ngày mới nhất).
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    /**
     * GET /api/orders/{orderId}
     * Lấy chi tiết một đơn hàng.
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(orderId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * PUT /api/orders/{orderId}/cancel
     * Khách hàng hủy đơn hàng (chỉ hủy được đơn PENDING).
     * Tự động hoàn trả số lượng kho.
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        try {
            Order canceledOrder = orderService.cancelOrder(orderId);
            return ResponseEntity.ok(canceledOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ==================== ADMIN ====================

    /**
     * GET /api/orders
     * Admin xem tất cả đơn hàng trong hệ thống.
     */
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * PUT /api/orders/{orderId}/status?status=SHIPPING
     * Admin cập nhật trạng thái đơn hàng.
     * Ví dụ: /api/orders/1/status?status=SHIPPING
     *        /api/orders/1/status?status=DELIVERED
     */
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}


package org.example.cellphone.controllers;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.CheckoutRequest;
import org.example.cellphone.entities.Order;
import org.example.cellphone.dto.response.OrderResponse;
import org.example.cellphone.mapper.OrderMapper;
import org.example.cellphone.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;
import org.example.cellphone.dto.response.ApiResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final OrderMapper orderMapper;

    // ==================== CHECKOUT ====================

    /**
     * POST /api/orders/checkout
     * Đặt hàng từ giỏ hàng của User.
     * Request Body: { "userId": 1, "addressId": 5 }
     */
    @PostMapping("/checkout")
    @PreAuthorize("#request.userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(@Valid @RequestBody CheckoutRequest request) {
        Order order = orderService.checkout(request);
        return ResponseEntity.ok(ApiResponse.success(orderMapper.toResponse(order), "Đặt hàng thành công"));
    }

    // ==================== KHÁCH HÀNG ====================

    /**
     * GET /api/orders/user/{userId}
     * Lấy lịch sử đơn hàng của User (sắp xếp theo ngày mới nhất).
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("#userId == authentication.principal.id or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrdersByUserId(userId).stream().map(orderMapper::toResponse).toList()));
    }

    /**
     * GET /api/orders/{orderId}
     * Lấy chi tiết một đơn hàng.
     */
    @GetMapping("/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(orderMapper.toResponse(orderService.getOrderById(orderId))));
    }

    /**
     * PUT /api/orders/{orderId}/cancel
     * Khách hàng hủy đơn hàng (chỉ hủy được đơn PENDING).
     * Tự động hoàn trả số lượng kho.
     */
    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long orderId) {
        Order canceledOrder = orderService.cancelOrder(orderId);
        return ResponseEntity.ok(ApiResponse.success(orderMapper.toResponse(canceledOrder), "Hủy đơn hàng thành công"));
    }

    // ==================== ADMIN ====================

    /**
     * GET /api/orders
     * Admin xem tất cả đơn hàng trong hệ thống.
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getAllOrders().stream().map(orderMapper::toResponse).toList()));
    }

    /**
     * PUT /api/orders/{orderId}/status
     * [Admin] Cập nhật trạng thái đơn hàng theo vòng đời:
     * PENDING_CONFIRMATION → CONFIRMED → SHIPPING → DELIVERED
     *
     * Request Body: { "status": "CONFIRMED" }
     * Chỉ chấp nhận: PENDING_CONFIRMATION, CONFIRMED, SHIPPING, DELIVERED.
     * Không thể cập nhật đơn đã CANCELED.
     */
    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody java.util.Map<String, String> body) {
        String status = body.get("status");
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(ApiResponse.success(orderMapper.toResponse(updatedOrder), "Cập nhật trạng thái thành công"));
    }
}


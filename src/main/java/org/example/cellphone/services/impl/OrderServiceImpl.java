package org.example.cellphone.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.CheckoutRequest;
import org.example.cellphone.entities.Address;
import org.example.cellphone.entities.Cart;
import org.example.cellphone.entities.CartItem;
import org.example.cellphone.entities.Order;
import org.example.cellphone.entities.OrderItem;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.entities.User;
import org.example.cellphone.repositories.AddressRepository;
import org.example.cellphone.repositories.CartRepository;
import org.example.cellphone.repositories.OrderRepository;
import org.example.cellphone.repositories.ProductVariantRepository;
import org.example.cellphone.repositories.UserRepository;
import org.example.cellphone.services.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AddressRepository addressRepository;

    /**
     * Xử lý đặt hàng (Checkout).
     * Sử dụng @Transactional để đảm bảo nếu có lỗi ở bất kỳ bước nào,
     * tất cả thay đổi (trừ kho, tạo order) đều được rollback.
     */
    @Override
    @Transactional
    public Order checkout(CheckoutRequest request) {

        // ======== BƯỚC 1: Kiểm tra User tồn tại ========
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy người dùng với id: " + request.getUserId()));

        // ======== BƯỚC 2: Kiểm tra giỏ hàng ========
        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Giỏ hàng đang trống"));

        // Kiểm tra giỏ hàng có CartItem nào không
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống");
        }

        // ======== BƯỚC 3: Kiểm tra tồn kho & Trừ kho ========
        for (CartItem cartItem : cart.getCartItems()) {
            ProductVariant variant = cartItem.getProductVariant();

            // So sánh số lượng mua vs số lượng tồn kho
            if (cartItem.getQuantity() > variant.getQuantityInStock()) {
                // Build mô tả variant từ các AttributeValue (ví dụ: "Đen, 128GB")
                String variantDesc = variant.getAttributes() != null
                        ? variant.getAttributes().stream()
                                .map(av -> av.getAttribute().getName() + ": " + av.getValue())
                                .collect(Collectors.joining(", "))
                        : "N/A";
                // Ném lỗi cụ thể với tên sản phẩm và thông số variant
                throw new RuntimeException(
                        "Sản phẩm [" + variant.getProduct().getName()
                                + " - " + variantDesc
                                + "] không đủ hàng trong kho"
                );
            }

            // Trừ số lượng tồn kho
            variant.setQuantityInStock(variant.getQuantityInStock() - cartItem.getQuantity());
            productVariantRepository.save(variant);
        }

        // ======== BƯỚC 4: Lookup Address từ DB ========
        Address address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy địa chỉ với id: " + request.getAddressId()));

        // Build full address string: "chi tiết, xã, tỉnh"
        String fullAddress = address.getDetailAddress()
                + ", " + address.getWard().getName()
                + ", " + address.getProvince().getName();

        // ======== BƯỚC 5: Tạo Order ========
        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(fullAddress);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PENDING"); // Trạng thái mặc định

        // Tạo danh sách OrderItem từ CartItem
        List<OrderItem> orderItems = new ArrayList<>();
        double totalPrice = 0.0;

        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductVariant(cartItem.getProductVariant());
            orderItem.setQuantity(cartItem.getQuantity());
            // Chốt giá tại thời điểm mua (lấy giá hiện tại của ProductVariant)
            orderItem.setPrice(cartItem.getProductVariant().getPrice());

            orderItems.add(orderItem);

            // Tính tổng tiền: giá * số lượng
            totalPrice += orderItem.getPrice() * orderItem.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);

        // Lưu Order (cascade ALL sẽ tự động lưu luôn các OrderItem)
        Order savedOrder = orderRepository.save(order);

        // ======== BƯỚC 5: Xóa sạch giỏ hàng ========
        // orphanRemoval = true trên Cart.cartItems sẽ tự động xóa CartItem trong DB
        cart.getCartItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    // ==================== XEM ĐƠN HÀNG ====================

    /**
     * Lấy lịch sử đơn hàng của một User, sắp xếp theo ngày mới nhất.
     */
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(userId);
    }

    /**
     * Lấy chi tiết một đơn hàng theo orderId.
     */
    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy đơn hàng với id: " + orderId));
    }

    // ==================== KHÁCH HÀNG: HỦY ĐƠN ====================

    /**
     * Hủy đơn hàng (chỉ cho phép hủy khi trạng thái là PENDING).
     * Sử dụng @Transactional để đảm bảo hoàn kho + cập nhật trạng thái là atomic.
     * Nếu có lỗi giữa chừng → rollback toàn bộ (kho không bị sai lệch).
     */
    @Override
    @Transactional
    public Order cancelOrder(Long orderId) {

        // Bước 1: Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy đơn hàng với id: " + orderId));

        // Bước 2: Kiểm tra trạng thái — chỉ cho hủy đơn PENDING
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Không thể hủy đơn hàng #" + orderId
                            + ". Chỉ có thể hủy đơn đang ở trạng thái PENDING. "
                            + "Trạng thái hiện tại: " + order.getStatus());
        }

        // Bước 3: Hoàn trả số lượng kho cho từng OrderItem
        for (OrderItem orderItem : order.getOrderItems()) {
            ProductVariant variant = orderItem.getProductVariant();

            // Cộng trả lại số lượng đã mua vào kho
            variant.setQuantityInStock(
                    variant.getQuantityInStock() + orderItem.getQuantity()
            );
            productVariantRepository.save(variant);
        }

        // Bước 4: Cập nhật trạng thái đơn hàng thành CANCELED
        order.setStatus("CANCELED");
        return orderRepository.save(order);
    }

    // ==================== ADMIN: QUẢN LÝ ĐƠN HÀNG ====================

    /**
     * Admin xem tất cả đơn hàng trong hệ thống.
     */
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    private static final java.util.Set<String> VALID_STATUSES = java.util.Set.of(
            "PENDING_CONFIRMATION",  // Đang xác nhận
            "CONFIRMED",            // Đã xác nhận
            "SHIPPING",             // Đang giao hàng
            "DELIVERED"             // Đã giao hàng
    );

    /**
     * Admin cập nhật trạng thái đơn hàng theo workflow:
     * PENDING_CONFIRMATION → CONFIRMED → SHIPPING → DELIVERED
     */
    @Override
    public Order updateOrderStatus(Long orderId, String status) {

        // Validate trạng thái hợp lệ
        if (status == null || !VALID_STATUSES.contains(status.toUpperCase())) {
            throw new RuntimeException(
                    "Trạng thái '" + status + "' không hợp lệ. "
                    + "Chỉ chấp nhận: PENDING_CONFIRMATION, CONFIRMED, SHIPPING, DELIVERED"
            );
        }

        // Tìm đơn hàng
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy đơn hàng với id: " + orderId));

        // Không cho phép thay đổi trạng thái đơn đã hủy
        if ("CANCELED".equals(order.getStatus())) {
            throw new RuntimeException(
                    "Không thể cập nhật trạng thái đơn hàng #" + orderId
                    + " vì đơn hàng đã bị hủy.");
        }

        // Cập nhật trạng thái mới (lưu ở dạng uppercase chuẩn)
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }
}


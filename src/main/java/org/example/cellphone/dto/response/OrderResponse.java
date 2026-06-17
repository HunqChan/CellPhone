package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@Setter
public class OrderResponse {
    private Long id;
    private UserResponse user;
    private String shippingAddress;
    private Double totalPrice;
    private String status;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> orderItems;
}

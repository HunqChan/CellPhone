package org.example.cellphone.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SUCCESS(200, "Thành công"),
    BAD_REQUEST(400, "Yêu cầu không hợp lệ"),
    UNAUTHORIZED(401, "Không có quyền truy cập"),
    FORBIDDEN(403, "Truy cập bị từ chối"),
    NOT_FOUND(404, "Không tìm thấy tài nguyên"),
    INTERNAL_SERVER_ERROR(500, "Lỗi hệ thống"),
    
    // Các lỗi logic nghiệp vụ
    USER_NOT_FOUND(404, "Không tìm thấy người dùng"),
    USER_EXISTED(400, "Người dùng đã tồn tại"),
    INVALID_PASSWORD(400, "Mật khẩu không chính xác"),
    CATEGORY_NOT_FOUND(404, "Không tìm thấy danh mục"),
    PRODUCT_NOT_FOUND(404, "Không tìm thấy sản phẩm");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}

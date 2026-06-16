package org.example.cellphone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Wrapper phân trang chuẩn — trả về cho client kèm metadata.
 *
 * @param <T> Kiểu phần tử trong danh sách kết quả
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PagedResponse<T> {

    /** Danh sách kết quả của trang hiện tại */
    private List<T> content;

    /** Số trang hiện tại (bắt đầu từ 0) */
    private int page;

    /** Số phần tử mỗi trang */
    private int size;

    /** Tổng số phần tử thỏa điều kiện */
    private long totalElements;

    /** Tổng số trang */
    private int totalPages;

    /** Đây có phải trang cuối không */
    private boolean last;
}

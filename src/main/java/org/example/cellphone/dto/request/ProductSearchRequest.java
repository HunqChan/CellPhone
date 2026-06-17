package org.example.cellphone.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Request body cho API tìm kiếm/lọc sản phẩm nâng cao.
 * Tất cả các trường đều tùy chọn — chỉ truyền những gì cần lọc.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchRequest {

    /** Từ khóa tìm kiếm theo tên sản phẩm (LIKE %keyword%) */
    private String search;

    /** Lọc theo ID danh mục */
    private Long categoryId;

    /** Lọc theo hãng sản xuất (không phân biệt hoa thường) */
    private String brand;

    /** Giá tối thiểu của biến thể sản phẩm */
    private Double minPrice;

    /** Giá tối đa của biến thể sản phẩm */
    private Double maxPrice;

    /**
     * Danh sách ID của AttributeValue cần lọc.
     * Ví dụ: [1, 5] = màu Đen AND dung lượng 256GB.
     */
    private List<Long> attributeValueIds;

    /** Số trang (bắt đầu từ 0, mặc định 0) */
    private int page = 0;

    /** Số sản phẩm mỗi trang (mặc định 10) */
    private int size = 10;

    /**
     * Trường sắp xếp: "name", "brand".
     * Lưu ý: sắp xếp theo "price" xử lý ở Specification (join variants).
     */
    private String sortBy = "id";

    /** Hướng sắp xếp: "asc" hoặc "desc" */
    private String sortDir = "asc";
}

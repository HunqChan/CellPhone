package org.example.cellphone.specifications;

import jakarta.persistence.criteria.*;
import org.example.cellphone.dto.request.ProductSearchRequest;
import org.example.cellphone.entities.AttributeValue;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Xây dựng Specification động cho Product dựa trên ProductSearchRequest.
 * Mỗi tiêu chí chỉ được thêm vào nếu giá trị truyền vào khác null/rỗng.
 */
public class ProductSpecification {

    private ProductSpecification() {}

    /**
     * Tạo Specification tổng hợp từ tất cả tiêu chí trong request.
     */
    public static Specification<Product> fromRequest(ProductSearchRequest request) {
        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Dùng DISTINCT để tránh product bị lặp khi JOIN nhiều bảng
            query.distinct(true);

            // ---- 1. Tìm kiếm theo tên (LIKE %keyword%) ----
            if (request.getSearch() != null && !request.getSearch().isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("name")),
                        "%" + request.getSearch().toLowerCase() + "%"
                ));
            }

            // ---- 2. Lọc theo categoryId ----
            if (request.getCategoryId() != null) {
                predicates.add(cb.equal(
                        root.get("category").get("id"),
                        request.getCategoryId()
                ));
            }

            // ---- 3. Lọc theo brand (không phân biệt hoa thường) ----
            if (request.getBrand() != null && !request.getBrand().isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("brand")),
                        "%" + request.getBrand().toLowerCase() + "%"
                ));
            }

            // ---- 4. Lọc theo khoảng giá (JOIN sang variants) ----
            if (request.getMinPrice() != null || request.getMaxPrice() != null) {
                Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.LEFT);

                if (request.getMinPrice() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(
                            variantJoin.get("price"), request.getMinPrice()
                    ));
                }
                if (request.getMaxPrice() != null) {
                    predicates.add(cb.lessThanOrEqualTo(
                            variantJoin.get("price"), request.getMaxPrice()
                    ));
                }
            }

            // ---- 5. Lọc theo AttributeValue IDs (màu sắc, dung lượng...) ----
            if (request.getAttributeValueIds() != null && !request.getAttributeValueIds().isEmpty()) {
                // JOIN: Product → variants → attributes (AttributeValue)
                Join<Product, ProductVariant> variantJoin = root.join("variants", JoinType.INNER);
                Join<ProductVariant, AttributeValue> attrJoin = variantJoin.join("attributes", JoinType.INNER);

                predicates.add(attrJoin.get("id").in(request.getAttributeValueIds()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

package org.example.cellphone.services.impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.CreateProductRequest;
import org.example.cellphone.entities.Category;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.repositories.CategoryRepository;
import org.example.cellphone.repositories.ProductRepository;
import org.example.cellphone.repositories.ProductVariantRepository;
import org.example.cellphone.services.ProductService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    public List<Product> getAllProducts() {
        // Gọi findAll() mặc định của JpaRepository để lấy toàn bộ sản phẩm
        return productRepository.findAll();
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        // Tìm kiếm sản phẩm theo tên, không phân biệt hoa thường (LIKE '%keyword%')
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Override
    public Product createProduct(CreateProductRequest request) {
        // Bước 1: Tìm Category theo categoryId từ request, nếu không tồn tại thì ném lỗi
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục với id: " + request.getCategoryId()));

        // Bước 2: Tạo đối tượng Product mới và gán các giá trị từ request
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());
        product.setBrand(request.getBrand());

        // Bước 3: Gán Category cho Product (thiết lập quan hệ ManyToOne)
        product.setCategory(category);

        // Bước 4: Lưu Product vào database và trả về kết quả
        return productRepository.save(product);
    }

    @Override
    public ProductVariant addVariant(Long productId, ProductVariant variant) {
        // Bước 1: Kiểm tra Product có tồn tại không
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + productId));

        // Bước 2: Gán Product cho Variant (thiết lập quan hệ ManyToOne)
        variant.setProduct(product);

        // Bước 3: Lưu Variant vào database
        return productVariantRepository.save(variant);
    }
}

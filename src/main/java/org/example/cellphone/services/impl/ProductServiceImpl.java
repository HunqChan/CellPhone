package org.example.cellphone.services.impl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.request.CreateProductRequest;
import org.example.cellphone.dto.request.CreateVariantRequest;
import org.example.cellphone.dto.response.PagedResponse;
import org.example.cellphone.dto.request.ProductSearchRequest;
import org.example.cellphone.entities.AttributeValue;
import org.example.cellphone.entities.Category;
import org.example.cellphone.entities.Product;
import org.example.cellphone.entities.ProductVariant;
import org.example.cellphone.exception.AppException;
import org.example.cellphone.exception.ErrorCode;
import org.example.cellphone.repositories.AttributeValueRepository;
import org.example.cellphone.repositories.CategoryRepository;
import org.example.cellphone.repositories.ProductRepository;
import org.example.cellphone.repositories.ProductVariantRepository;
import org.example.cellphone.services.ProductService;
import org.example.cellphone.specifications.ProductSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantRepository productVariantRepository;
    private final AttributeValueRepository attributeValueRepository;

    @Override
    public List<Product> getAllProducts() {
        // Gọi findAll() mặc định của JpaRepository để lấy toàn bộ sản phẩm
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    @Override
    public List<Product> searchProducts(String keyword) {
        // Tìm kiếm sản phẩm theo tên, không phân biệt hoa thường (LIKE '%keyword%')
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    @Override
    public List<Product> getProductsByCategoryId(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    @Override
    public Product createProduct(CreateProductRequest request) {
        // Bước 1: Tìm Category theo categoryId từ request, nếu không tồn tại thì ném lỗi
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

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
    public Product updateProduct(Long id, CreateProductRequest request) {
        // Kiểm tra product tồn tại
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Cập nhật thông tin cơ bản
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setImage(request.getImage());
        product.setBrand(request.getBrand());

        // Cập nhật category nếu thay đổi
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new AppException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        productRepository.deleteById(id);
    }

    @Override
    public ProductVariant addVariant(Long productId, CreateVariantRequest request) {
        // Bước 1: Kiểm tra Product có tồn tại không
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + productId));

        // Bước 2: Tạo ProductVariant từ DTO
        ProductVariant variant = new ProductVariant();
        variant.setPrice(request.getPrice());
        variant.setQuantityInStock(request.getQuantityInStock());
        variant.setProduct(product);

        // Bước 3: Resolve attribute values nếu có
        if (request.getAttributeValueIds() != null && !request.getAttributeValueIds().isEmpty()) {
            Set<AttributeValue> attributeValues = new HashSet<>(
                    attributeValueRepository.findAllById(request.getAttributeValueIds())
            );
            variant.setAttributes(attributeValues);
        }

        // Bước 4: Lưu Variant vào database
        return productVariantRepository.save(variant);
    }

    // ==================== BỘ LỌC ĐỘNG + PHÂN TRANG ====================

    @Override
    public PagedResponse<Product> filterProducts(ProductSearchRequest request) {

        // Xây dựng Sort — mặc định theo "id" nếu sortBy không hợp lệ
        String sortBy = (request.getSortBy() != null && !request.getSortBy().isBlank())
                ? request.getSortBy() : "id";
        Sort.Direction direction = "desc".equalsIgnoreCase(request.getSortDir())
                ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort sort = Sort.by(direction, sortBy);

        // Xây dựng Pageable
        Pageable pageable = PageRequest.of(request.getPage(), request.getSize(), sort);

        // Thực thi query với Specification động
        Page<Product> page = productRepository.findAll(
                ProductSpecification.fromRequest(request),
                pageable
        );

        // Map sang PagedResponse để trả về cho client
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
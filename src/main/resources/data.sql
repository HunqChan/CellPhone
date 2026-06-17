-- Tạo Roles (Bỏ qua nếu đã tồn tại nhờ INSERT IGNORE)
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_CUSTOMER');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_ADMIN');

-- Mật khẩu mặc định là '123456' đã được mã hóa BCrypt
-- Tạo Users: 1 Admin và 1 Customer
INSERT IGNORE INTO users (id, email, password, full_name, phone, role_id) VALUES 
(1, 'admin@gmail.com', '$2a$10$lUeABRXiyNwt6Y1C4MEpruU2YFD13CjdFGQAm3Mj0.OxjnWL.vBcm', 'Quản Trị Viên', '0987654321', 2),
(2, 'user@gmail.com', '$2a$10$lUeABRXiyNwt6Y1C4MEpruU2YFD13CjdFGQAm3Mj0.OxjnWL.vBcm', 'Khách Hàng 1', '0123456789', 1);

-- Tạo Categories (Danh mục)
INSERT IGNORE INTO categories (id, name) VALUES 
(1, 'Điện thoại'),
(2, 'Laptop'),
(3, 'Tablet'),
(4, 'Phụ kiện');

-- Tạo Attributes (Thuộc tính)
INSERT IGNORE INTO attributes (id, name) VALUES 
(1, 'Màu sắc'),
(2, 'Dung lượng lưu trữ'),
(3, 'RAM');

-- Tạo Attribute Values (Giá trị thuộc tính)
INSERT IGNORE INTO attribute_values (id, value, attribute_id) VALUES 
(1, 'Đen', 1),
(2, 'Trắng', 1),
(3, 'Titan Tự Nhiên', 1),
(4, '128GB', 2),
(5, '256GB', 2),
(6, '512GB', 2),
(7, '8GB', 3),
(8, '12GB', 3);

-- Tạo Products (Sản phẩm)
INSERT IGNORE INTO products (id, name, description, image, brand, category_id) VALUES 
(1, 'iPhone 15 Pro Max', 'Điện thoại cao cấp nhất của Apple năm 2023.', 'iphone15pm.jpg', 'Apple', 1),
(2, 'Samsung Galaxy S24 Ultra', 'Flagship Android với bút S-Pen xịn xò.', 's24ultra.jpg', 'Samsung', 1),
(3, 'MacBook Air M2', 'Laptop mỏng nhẹ, pin trâu của Apple.', 'macbook_air_m2.jpg', 'Apple', 2);

-- Tạo Product Variants (Biến thể sản phẩm)
INSERT IGNORE INTO product_variants (id, price, quantity_in_stock, product_id) VALUES 
(1, 29990000.0, 50, 1), -- iPhone 15 PM - Đen - 256GB
(2, 32990000.0, 30, 1), -- iPhone 15 PM - Titan - 512GB
(3, 25990000.0, 100, 2), -- S24 Ultra - Đen - 256GB - 12GB RAM
(4, 24990000.0, 20, 3); -- Mac Air M2 - Trắng - 256GB - 8GB RAM

-- Gán thuộc tính cho từng biến thể sản phẩm (Product Variant Attributes)
INSERT IGNORE INTO product_variant_attributes (product_variant_id, attribute_value_id) VALUES 
-- iPhone 15 PM, Biến thể 1: Đen, 256GB
(1, 1), (1, 5),
-- iPhone 15 PM, Biến thể 2: Titan, 512GB
(2, 3), (2, 6),
-- S24 Ultra, Biến thể 3: Đen, 256GB, 12GB RAM
(3, 1), (3, 5), (3, 8),
-- Mac Air M2, Biến thể 4: Trắng, 256GB, 8GB RAM
(4, 2), (4, 5), (4, 7);

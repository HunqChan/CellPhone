package org.example.cellphone.config;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.entities.Role;
import org.example.cellphone.repositories.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    // Hàm này tự động chạy khi Spring Boot khởi động xong
    @Override
    public void run(String... args) {
        // Chỉ insert nếu bảng roles đang rỗng (tránh insert trùng khi restart app)
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, "ROLE_CUSTOMER"));
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
            System.out.println("✅ Đã khởi tạo 2 role: ROLE_CUSTOMER, ROLE_ADMIN");
        }
    }
}

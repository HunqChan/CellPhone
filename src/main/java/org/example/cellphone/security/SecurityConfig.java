package org.example.cellphone.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Tắt CSRF vì dùng JWT (stateless), không cần CSRF token
                .csrf(csrf -> csrf.disable())

                // Cấu hình quyền truy cập cho từng URL
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập tự do các API đăng ký, đăng nhập
                        .requestMatchers("/api/auth/**").permitAll()
                        
                        // Các API công khai: xem và tìm kiếm sản phẩm, danh mục, địa điểm, thuộc tính
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/locations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/attributes/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/products/search").permitAll()
                        
                        // Swagger UI
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // Quyền Admin: quản lý tạo/sửa/xóa sản phẩm, danh mục, thuộc tính, kho hàng
                        .requestMatchers(HttpMethod.POST, "/api/products/**", "/api/categories/**", "/api/attributes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**", "/api/categories/**", "/api/attributes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**", "/api/categories/**", "/api/attributes/**").hasRole("ADMIN")
                        .requestMatchers("/api/inventory/**").hasRole("ADMIN")

                        // Quyền User: giỏ hàng, checkout, đơn hàng, địa chỉ
                        .requestMatchers("/api/cart/**", "/api/orders/**", "/api/addresses/**").hasAnyRole("CUSTOMER", "ADMIN")

                        // Tất cả các request còn lại phải đăng nhập
                        .anyRequest().authenticated()
                )

                // Không dùng Session (vì dùng JWT, mỗi request tự xác thực bằng token)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Thêm JwtFilter VÀO TRƯỚC filter mặc định của Spring Security
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean mã hóa mật khẩu bằng BCrypt (thuật toán hash một chiều, không thể giải mã ngược)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Bean quản lý xác thực, Spring Security dùng để xác thực email + password khi login
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

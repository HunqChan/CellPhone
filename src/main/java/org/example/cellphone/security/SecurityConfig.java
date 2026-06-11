package org.example.cellphone.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
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
                        // Cho phép xem sản phẩm và danh mục mà không cần đăng nhập
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
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

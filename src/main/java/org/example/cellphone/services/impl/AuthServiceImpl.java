package org.example.cellphone.services.impl;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.response.AuthResponse;
import org.example.cellphone.dto.request.LoginRequest;
import org.example.cellphone.dto.request.RegisterRequest;
import org.example.cellphone.entities.Role;
import org.example.cellphone.entities.User;
import org.example.cellphone.repositories.RoleRepository;
import org.example.cellphone.repositories.UserRepository;
import org.example.cellphone.security.JwtUtil;
import org.example.cellphone.services.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Bước 1: Kiểm tra email đã tồn tại trong hệ thống chưa
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã được sử dụng: " + request.getEmail());
        }

        // Bước 2: Tìm Role mặc định là ROLE_CUSTOMER cho user mới đăng ký
        Role customerRole = roleRepository.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role ROLE_CUSTOMER trong database"));

        // Bước 3: Tạo đối tượng User mới
        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        // Mã hóa mật khẩu trước khi lưu (BCrypt hash, không lưu plaintext)
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(customerRole);

        // Bước 4: Lưu user vào database
        userRepository.save(user);

        // Bước 5: Tạo JWT token cho user vừa đăng ký (tự động đăng nhập sau khi đăng ký)
        String token = jwtUtil.generateToken(user.getEmail());

        // Bước 6: Trả về response chứa token và thông tin user
        return new AuthResponse(token, user.getEmail(), user.getFullName(), customerRole.getName());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Bước 1: Xác thực email + password thông qua AuthenticationManager của Spring Security
        // Nếu sai email hoặc password, Spring Security sẽ tự động ném Exception
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Bước 2: Nếu xác thực thành công, lấy thông tin User từ database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        // Bước 3: Tạo JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        // Bước 4: Trả về response
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole().getName());
    }
}

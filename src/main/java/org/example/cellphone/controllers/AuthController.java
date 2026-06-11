package org.example.cellphone.controllers;

import lombok.RequiredArgsConstructor;
import org.example.cellphone.dto.AuthResponse;
import org.example.cellphone.dto.LoginRequest;
import org.example.cellphone.dto.RegisterRequest;
import org.example.cellphone.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register -> Đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST /api/auth/login -> Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // POST /api/auth/logout -> Đăng xuất
    // JWT là stateless, server không lưu session.
    // Đăng xuất = client tự xóa token ở phía frontend.
    // API này chỉ trả về thông báo thành công.
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Đăng xuất thành công. Vui lòng xóa token ở phía client.");
    }
}

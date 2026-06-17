package org.example.cellphone.services;

import org.example.cellphone.dto.response.AuthResponse;
import org.example.cellphone.dto.request.LoginRequest;
import org.example.cellphone.dto.request.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}

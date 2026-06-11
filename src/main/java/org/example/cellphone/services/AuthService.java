package org.example.cellphone.services;

import org.example.cellphone.dto.AuthResponse;
import org.example.cellphone.dto.LoginRequest;
import org.example.cellphone.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}

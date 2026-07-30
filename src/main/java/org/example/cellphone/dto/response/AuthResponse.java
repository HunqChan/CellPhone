package org.example.cellphone.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long userId;

    private String token;

    private String email;

    private String fullName;

    private String role;
}

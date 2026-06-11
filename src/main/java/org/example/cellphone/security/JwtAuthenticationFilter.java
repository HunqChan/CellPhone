package org.example.cellphone.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Bước 1: Lấy header "Authorization" từ request
        String authHeader = request.getHeader("Authorization");

        // Bước 2: Kiểm tra header có tồn tại và bắt đầu bằng "Bearer " không
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // Không có token -> bỏ qua, để request đi tiếp (có thể là API public)
            filterChain.doFilter(request, response);
            return;
        }

        // Bước 3: Cắt chuỗi "Bearer " để lấy token thực tế
        String token = authHeader.substring(7);

        // Bước 4: Trích xuất email từ token
        String email = jwtUtil.extractEmail(token);

        // Bước 5: Nếu email hợp lệ và chưa có ai đăng nhập trong context hiện tại
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Bước 6: Load thông tin user từ database
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            // Bước 7: Xác thực token (đúng email + chưa hết hạn)
            if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {

                // Bước 8: Tạo Authentication object và đặt vào SecurityContext
                // Từ đây Spring Security coi user này đã đăng nhập
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Bước 9: Cho request đi tiếp trong chuỗi filter
        filterChain.doFilter(request, response);
    }
}

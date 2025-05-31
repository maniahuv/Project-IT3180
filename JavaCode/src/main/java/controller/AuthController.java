package controller;

import model.TaiKhoan;
import service.TaiKhoanService;
import config.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final TaiKhoanService taiKhoanService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(TaiKhoanService taiKhoanService, AuthenticationManager authenticationManager, JwtTokenProvider jwtTokenProvider) {
        this.taiKhoanService = taiKhoanService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody TaiKhoan taiKhoan) {
        try {
            TaiKhoan created = taiKhoanService.create(taiKhoan);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String username = credentials.get("username");
            String password = credentials.get("password");
            System.out.println("Đang đăng nhập: " + username + " / " + password);
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            TaiKhoan taiKhoan = taiKhoanService.findByUsername(username); // Assume this method exists
            System.out.println("TK sau xác thực: " + taiKhoan);
            Integer vaiTro = taiKhoan.getVaiTro(); // Get vaiTro (1, 2, or 3)
            String hoTen = taiKhoan.getHoTen(); // Get hoTen
            String token = jwtTokenProvider.generateToken(userDetails, vaiTro, hoTen);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("vaiTro", vaiTro);
            response.put("hoTen", hoTen);
            response.put("message", "Đăng nhập thành công");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace(); // In stacktrace để xem lỗi thật
            return ResponseEntity.status(401).body("Đăng nhập thất bại");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Nếu bạn có blacklist token, xử lý ở đây

        // Còn không, chỉ trả về thành công để client xoá token
        return ResponseEntity.ok("Logout successful");
    }
    

}
package controller;

import model.TaiKhoan;
import service.TaiKhoanService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")  // Cho phép React frontend truy cập API
public class AuthController {

    private final TaiKhoanService taiKhoanService;
    private final AuthenticationManager authenticationManager;

    public AuthController(TaiKhoanService taiKhoanService, AuthenticationManager authenticationManager) {
        this.taiKhoanService = taiKhoanService;
        this.authenticationManager = authenticationManager;
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

            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            return ResponseEntity.ok("Đăng nhập thành công");
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Đăng nhập thất bại");
        }
    }
}

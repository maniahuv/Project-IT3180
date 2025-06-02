package config;

import model.TaiKhoan;
import repository.TaiKhoanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(TaiKhoanRepository taiKhoanRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Tạo tài khoản Tổ Trưởng
            if (taiKhoanRepository.findByUsername("totruong1").isEmpty()) {
                TaiKhoan toTruong = new TaiKhoan();
                toTruong.setUsername("totruong1");
                toTruong.setPassword(passwordEncoder.encode("123456"));
                toTruong.setVaiTro(1);  // 1 = TO_TRUONG
                toTruong.setHoTen("Nguyễn Văn Trưởng");
                taiKhoanRepository.save(toTruong);
                System.out.println("✓ Seed tài khoản Tổ Trưởng đã được tạo!");
            }

            // Tạo tài khoản Tổ Phó
            if (taiKhoanRepository.findByUsername("topho1").isEmpty()) {
                TaiKhoan toPho = new TaiKhoan();
                toPho.setUsername("topho1");
                toPho.setPassword(passwordEncoder.encode("123456"));
                toPho.setVaiTro(2);  // 2 = TO_PHO
                toPho.setHoTen("Trần Thị Phó");
                taiKhoanRepository.save(toPho);
                System.out.println("✓ Seed tài khoản Tổ Phó đã được tạo!");
            }

            // Tạo tài khoản Kế Toán
            if (taiKhoanRepository.findByUsername("ketoan1").isEmpty()) {
                TaiKhoan keToan = new TaiKhoan();
                keToan.setUsername("ketoan1");
                keToan.setPassword(passwordEncoder.encode("123456"));
                keToan.setVaiTro(3);  // 3 = KE_TOAN
                keToan.setHoTen("Lê Văn Toán");
                taiKhoanRepository.save(keToan);
                System.out.println("✓ Seed tài khoản Kế Toán đã được tạo!");
            }

            // Tạo thêm một số tài khoản khác cho testing
            if (taiKhoanRepository.findByUsername("totruong2").isEmpty()) {
                TaiKhoan toTruong2 = new TaiKhoan();
                toTruong2.setUsername("totruong2");
                toTruong2.setPassword(passwordEncoder.encode("123456"));
                toTruong2.setVaiTro(1);  // 1 = TO_TRUONG
                toTruong2.setHoTen("Phạm Minh Trưởng");
                taiKhoanRepository.save(toTruong2);
                System.out.println("✓ Seed tài khoản Tổ Trưởng 2 đã được tạo!");
            }

            if (taiKhoanRepository.findByUsername("topho2").isEmpty()) {
                TaiKhoan toPho2 = new TaiKhoan();
                toPho2.setUsername("topho2");
                toPho2.setPassword(passwordEncoder.encode("123456"));
                toPho2.setVaiTro(2);  // 2 = TO_PHO
                toPho2.setHoTen("Hoàng Thị Phó");
                taiKhoanRepository.save(toPho2);
                System.out.println("✓ Seed tài khoản Tổ Phó 2 đã được tạo!");
            }

            if (taiKhoanRepository.findByUsername("ketoan2").isEmpty()) {
                TaiKhoan keToan2 = new TaiKhoan();
                keToan2.setUsername("ketoan2");
                keToan2.setPassword(passwordEncoder.encode("123456"));
                keToan2.setVaiTro(3);  // 3 = KE_TOAN
                keToan2.setHoTen("Đỗ Thị Toán");
                taiKhoanRepository.save(keToan2);
                System.out.println("✓ Seed tài khoản Kế Toán 2 đã được tạo!");
            }

            System.out.println("=== Hoàn thành khởi tạo dữ liệu seed ===");
            System.out.println("Danh sách tài khoản đã tạo:");
            System.out.println("- totruong1/123456 (Tổ Trưởng)");
            System.out.println("- totruong2/123456 (Tổ Trưởng)");
            System.out.println("- topho1/123456 (Tổ Phó)");
            System.out.println("- topho2/123456 (Tổ Phó)");
            System.out.println("- ketoan1/123456 (Kế Toán)");
            System.out.println("- ketoan2/123456 (Kế Toán)");
        };
    }
}
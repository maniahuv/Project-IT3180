package model;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;
import enums.VaiTro;

@Entity
@Table(name = "taikhoan")
public class TaiKhoan implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, name = "vaiTro")
    private int vaiTro;  // 1: TO_TRUONG, 2: TO_PHO, 3: KE_TOAN

    @Column(name = "hoTen")
    private String hoTen;

    // Constructors
    public TaiKhoan() {}

    public TaiKhoan(String username, String password, int vaiTro, String hoTen) {
        this.username = username;
        this.password = password;
        this.vaiTro = vaiTro;
        this.hoTen = hoTen;
    }

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public int getVaiTro() { return vaiTro; }
    public void setVaiTro(int vaiTro) { this.vaiTro = vaiTro; }
    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    // UserDetails interface
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        VaiTro role = VaiTro.fromValue(this.vaiTro);
        return Collections.singletonList(() -> "ROLE_" + role.getRoleName());
    }

}

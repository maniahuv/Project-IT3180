// DotThu.java
package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "dotthu")
public class DotThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maDotThu;

    @Column(nullable = false, length = 100)
    private String tenDotThu;

    private LocalDate ngayBatDau;

    private LocalDate ngayKetThuc;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TrangThai trangThai;

    @OneToMany(mappedBy = "dotThu", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<KhoanThu> khoanThus;

    public enum TrangThai {
        DANG_DIEN_RA("Đang diễn ra"),
        DA_HOAN_THANH("Đã hoàn thành"),
        TAM_HOAN("Tạm hoãn");

        private final String value;
        TrangThai(String value) { this.value = value; }
        public String getValue() { return value; }
    }

    // Getters and Setters
    public Integer getMaDotThu() { return maDotThu; }
    public void setMaDotThu(Integer maDotThu) { this.maDotThu = maDotThu; }
    public String getTenDotThu() { return tenDotThu; }
    public void setTenDotThu(String tenDotThu) { this.tenDotThu = tenDotThu; }
    public LocalDate getNgayBatDau() { return ngayBatDau; }
    public void setNgayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; }
    public LocalDate getNgayKetThuc() { return ngayKetThuc; }
    public void setNgayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; }
    public String getTrangThai() { return trangThai != null ? trangThai.name() : null; } // Return enum name
    public void setTrangThai(String trangThai) {
        if (trangThai != null) {
            try {
                this.trangThai = TrangThai.valueOf(trangThai.replace(" ", "_").toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Trạng thái không hợp lệ: " + trangThai);
            }
        } else {
            this.trangThai = null;
        }
    }
    public List<KhoanThu> getKhoanThus() { return khoanThus; }
    public void setKhoanThus(List<KhoanThu> khoanThus) { this.khoanThus = khoanThus; }
}
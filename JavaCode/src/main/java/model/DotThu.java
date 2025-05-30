package model;

import jakarta.persistence.*;
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

    @Column(length = 50)
    private String trangThai;

    @OneToMany(mappedBy = "dotThu", cascade = CascadeType.ALL)
    private List<KhoanThuDotThu> khoanThus;

    // Getters and Setters

    public Integer getMaDotThu() { return maDotThu; }
    public void setMaDotThu(Integer maDotThu) { this.maDotThu = maDotThu; }

    public String getTenDotThu() { return tenDotThu; }
    public void setTenDotThu(String tenDotThu) { this.tenDotThu = tenDotThu; }

    public LocalDate getNgayBatDau() { return ngayBatDau; }
    public void setNgayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; }

    public LocalDate getNgayKetThuc() { return ngayKetThuc; }
    public void setNgayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public List<KhoanThuDotThu> getKhoanThus() { return khoanThus; }
    public void setKhoanThus(List<KhoanThuDotThu> khoanThus) { this.khoanThus = khoanThus; }
}

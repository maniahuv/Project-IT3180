package model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "khoanthu")
public class KhoanThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maKhoanThu;

    @Column(nullable = false, length = 100)
    private String tenKhoanThu;

    private String loaiKhoanThu;

    private Float soTien;

    private boolean batBuoc;

    @Column(length = 1000)
    private String ghiChu;

    @ManyToOne
    @JoinColumn(name = "idNguoiTao")
    private TaiKhoan nguoiTao;

    @OneToMany(mappedBy = "khoanThu", cascade = CascadeType.ALL)
    private List<KhoanThuDotThu> dotThus;

    // Getters & Setters
    public Integer getMaKhoanThu() { return maKhoanThu; }
    public void setMaKhoanThu(Integer maKhoanThu) { this.maKhoanThu = maKhoanThu; }

    public String getTenKhoanThu() { return tenKhoanThu; }
    public void setTenKhoanThu(String tenKhoanThu) { this.tenKhoanThu = tenKhoanThu; }

    public String getLoaiKhoanThu() { return loaiKhoanThu; }
    public void setLoaiKhoanThu(String loaiKhoanThu) { this.loaiKhoanThu = loaiKhoanThu; }

    public Float getSoTien() { return soTien; }
    public void setSoTien(Float soTien) { this.soTien = soTien; }

    public boolean isBatBuoc() { return batBuoc; }
    public void setBatBuoc(boolean batBuoc) { this.batBuoc = batBuoc; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public TaiKhoan getNguoiTao() { return nguoiTao; }
    public void setNguoiTao(TaiKhoan nguoiTao) { this.nguoiTao = nguoiTao; }

    public List<KhoanThuDotThu> getDotThus() { return dotThus; }
    public void setDotThus(List<KhoanThuDotThu> dotThus) { this.dotThus = dotThus; }
}

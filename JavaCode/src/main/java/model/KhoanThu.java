package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "khoanthu")
public class KhoanThu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maKhoanThu;

    @Column(nullable = false, length = 100)
    private String tenKhoanThu;

    @Column(length = 50)
    private String loaiKhoanThu;

    private Float soTien;

    private boolean batBuoc;

    @Column(length = 1000)
    private String ghiChu;

    @ManyToOne
    @JoinColumn(name = "maDotThu")
    @JsonBackReference
    private DotThu dotThu;

    @Transient // Not persisted in the database
    @JsonProperty("maDotThu") // Include in JSON response
    private Integer maDotThuTransient;

    // Initialize transient field after loading entity
    @PostLoad
    private void populateMaDotThu() {
        this.maDotThuTransient = (dotThu != null) ? dotThu.getMaDotThu() : null;
    }

    // Getters and Setters
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
    public DotThu getDotThu() { return dotThu; }
    public void setDotThu(DotThu dotThu) { 
        this.dotThu = dotThu; 
        this.maDotThuTransient = (dotThu != null) ? dotThu.getMaDotThu() : null; 
    }
    public Integer getMaDotThuTransient() { return maDotThuTransient; }
    public void setMaDotThuTransient(Integer maDotThuTransient) { this.maDotThuTransient = maDotThuTransient; }
}
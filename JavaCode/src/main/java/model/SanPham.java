

package model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "san_pham")
public class SanPham {
    @Id
    @Column(name = "id_sp", length = 50)
    private String idSp;

    @Column(name = "ten", nullable = false, length = 255)
    private String ten;

    @Column(name = "ngay_nhap_hang", nullable = false)
    private LocalDate ngayNhapHang;

    @Column(name = "don_gia_goc", nullable = false, precision = 10, scale = 2)
    private BigDecimal donGiaGoc;

    @Column(name = "gia_ban", nullable = false, precision = 10, scale = 2)
    private BigDecimal giaBan;

    @Column(name = "ton_kho", nullable = false)
    private Integer tonKho;

    @Column(name = "da_ban", nullable = false)
    private Integer daBan;

    @Column(name = "mo_ta")
    private String moTa;

    

    // Constructors
    public SanPham() {
    }

    public SanPham(String idSp, String ten, LocalDate ngayNhapHang, BigDecimal donGiaGoc, BigDecimal giaBan,
                   Integer tonKho, Integer daBan, String moTa) {
        this.idSp = idSp;
        this.ten = ten;
        this.ngayNhapHang = ngayNhapHang;
        this.donGiaGoc = donGiaGoc;
        this.giaBan = giaBan;
        this.tonKho = tonKho;
        this.daBan = daBan;
        this.moTa = moTa;
        
    }

    // Getters and Setters
    public String getIdSp() {
        return idSp;
    }

    public void setIdSp(String idSp) {
        this.idSp = idSp;
    }

    public String getTen() {
        return ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public LocalDate getNgayNhapHang() {
        return ngayNhapHang;
    }

    public void setNgayNhapHang(LocalDate ngayNhapHang) {
        this.ngayNhapHang = ngayNhapHang;
    }

    public BigDecimal getDonGiaGoc() {
        return donGiaGoc;
    }

    public void setDonGiaGoc(BigDecimal donGiaGoc) {
        this.donGiaGoc = donGiaGoc;
    }

    public BigDecimal getGiaBan() {
        return giaBan;
    }

    public void setGiaBan(BigDecimal giaBan) {
        this.giaBan = giaBan;
    }

    public Integer getTonKho() {
        return tonKho;
    }

    public void setTonKho(Integer tonKho) {
        this.tonKho = tonKho;
    }

    public Integer getDaBan() {
        return daBan;
    }

    public void setDaBan(Integer daBan) {
        this.daBan = daBan;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    
}
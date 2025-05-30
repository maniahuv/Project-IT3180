package model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "nopphi")
public class NopPhi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "IDNopTien")
    private Integer id;

    private LocalDate ngayThu;

    private Float soTien;

    @Column(length = 100)
    private String nguoiNop;

    // Người thu - liên kết tới tài khoản kế toán
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idNguoiThu", nullable = false)
    private TaiKhoan nguoiThu;

    // Mã hộ khẩu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoKhau", nullable = false)
    private HoKhau hoKhau;

    // Liên kết tới bảng khoanthu_has_dotthu (KhoanThuDotThu)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idKhoanThuDotThu", nullable = false)
    private KhoanThuDotThu khoanThuDotThu;

    public NopPhi() {
    }

    public NopPhi(LocalDate ngayThu, Float soTien, String nguoiNop, TaiKhoan nguoiThu, HoKhau hoKhau, KhoanThuDotThu khoanThuDotThu) {
        this.ngayThu = ngayThu;
        this.soTien = soTien;
        this.nguoiNop = nguoiNop;
        this.nguoiThu = nguoiThu;
        this.hoKhau = hoKhau;
        this.khoanThuDotThu = khoanThuDotThu;
    }

    // Getters và Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getNgayThu() {
        return ngayThu;
    }

    public void setNgayThu(LocalDate ngayThu) {
        this.ngayThu = ngayThu;
    }

    public Float getSoTien() {
        return soTien;
    }

    public void setSoTien(Float soTien) {
        this.soTien = soTien;
    }

    public String getNguoiNop() {
        return nguoiNop;
    }

    public void setNguoiNop(String nguoiNop) {
        this.nguoiNop = nguoiNop;
    }

    public TaiKhoan getNguoiThu() {
        return nguoiThu;
    }

    public void setNguoiThu(TaiKhoan nguoiThu) {
        this.nguoiThu = nguoiThu;
    }

    public HoKhau getHoKhau() {
        return hoKhau;
    }

    public void setHoKhau(HoKhau hoKhau) {
        this.hoKhau = hoKhau;
    }

    public KhoanThuDotThu getKhoanThuDotThu() {
        return khoanThuDotThu;
    }

    public void setKhoanThuDotThu(KhoanThuDotThu khoanThuDotThu) {
        this.khoanThuDotThu = khoanThuDotThu;
    }
    
}

package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
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
    @JsonBackReference
    private TaiKhoan nguoiThu;

    // Mã hộ khẩu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoKhau", nullable = false)
    @JsonBackReference
    private HoKhau hoKhau;

    // Liên kết tới bảng khoanthu
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhoanThu", nullable = false)
    @JsonBackReference
    private KhoanThu khoanThu;

    public NopPhi() {
    }

    public NopPhi(LocalDate ngayThu, Float soTien, String nguoiNop, TaiKhoan nguoiThu, HoKhau hoKhau, KhoanThu khoanThu) {
        this.ngayThu = ngayThu;
        this.soTien = soTien;
        this.nguoiNop = nguoiNop;
        this.nguoiThu = nguoiThu;
        this.hoKhau = hoKhau;
        this.khoanThu = khoanThu;
    }

    // Getters and Setters
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

    public KhoanThu getKhoanThu() {
        return khoanThu;
    }

    public void setKhoanThu(KhoanThu khoanThu) {
        this.khoanThu = khoanThu;
    }
}
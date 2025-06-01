package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;

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

    // Relationship with HoKhau
    @ManyToOne
    @JoinColumn(name = "maHoKhau")
    @JsonBackReference
    private HoKhau hoKhau;

    @Transient
    @JsonProperty("maHoKhau")
    private Integer maHoKhauTransient;

    // Relationship with KhoanThu
    @ManyToOne
    @JoinColumn(name = "maKhoanThu")
    @JsonBackReference
    private KhoanThu khoanThu;

    @Transient
    @JsonProperty("maKhoanThu")
    private Integer maKhoanThuTransient;

    // Relationship with TaiKhoan (Nguoi thu)
    @ManyToOne
    @JoinColumn(name = "idNguoiThu")
    @JsonBackReference
    private TaiKhoan nguoiThu;

    @Transient
    @JsonProperty("idNguoiThu")
    private Integer idNguoiThuTransient;

  
    @PostLoad
    private void populateTransientFields() {
        this.maHoKhauTransient = (hoKhau != null) ? hoKhau.getMaHoKhau() : null;
        this.maKhoanThuTransient = (khoanThu != null) ? khoanThu.getMaKhoanThu() : null;
        this.idNguoiThuTransient = (nguoiThu != null) ? nguoiThu.getId() : null;
    }

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
        this.idNguoiThuTransient = (nguoiThu != null) ? nguoiThu.getId() : null;
    }

    public Integer getIdNguoiThuTransient() {
        return idNguoiThuTransient;
    }

    public void setIdNguoiThuTransient(Integer idNguoiThuTransient) {
        this.idNguoiThuTransient = idNguoiThuTransient;
    }

    public void setHoKhau(HoKhau hoKhau) {
        this.hoKhau = hoKhau;
        this.maHoKhauTransient = (hoKhau != null) ? hoKhau.getMaHoKhau() : null;
    }

    public Integer getMaHoKhauTransient() {
        return maHoKhauTransient;
    }

    public void setMaHoKhauTransient(Integer maHoKhauTransient) {
        this.maHoKhauTransient = maHoKhauTransient;
    }

    public KhoanThu getKhoanThu() {
        return khoanThu;
    }

    public void setKhoanThu(KhoanThu khoanThu) {
        this.khoanThu = khoanThu;
        this.maKhoanThuTransient = (khoanThu != null) ? khoanThu.getMaKhoanThu() : null;
    }

    public Integer getMaKhoanThuTransient() {
        return maKhoanThuTransient;
    }

    public void setMaKhoanThuTransient(Integer maKhoanThuTransient) {
        this.maKhoanThuTransient = maKhoanThuTransient;
    }
}

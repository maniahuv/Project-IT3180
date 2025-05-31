package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDate;

@Entity
@Table(name = "nhankhau")
public class NhanKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maNhanKhau;

    @Column
    private String hoTen;

    @Column
    private LocalDate ngaySinh;

    @Column
    private Boolean gioiTinh;

    @Column
    private String cmnd;

    @Column
    private String qhVoiChuHo;

    @Column
    private String trangThai;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoKhau")
    @JsonBackReference(value = "hokhau-nhankhau")
    private HoKhau hoKhau;

    // Constructors
    public NhanKhau() {}

    // Getters and Setters
    public Integer getMaNhanKhau() { return maNhanKhau; }
    public void setMaNhanKhau(Integer maNhanKhau) { this.maNhanKhau = maNhanKhau; }
    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }
    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }
    public Boolean getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(Boolean gioiTinh) { this.gioiTinh = gioiTinh; }
    public String getCmnd() { return cmnd; }
    public void setCmnd(String cmnd) { this.cmnd = cmnd; }
    public String getQhVoiChuHo() { return qhVoiChuHo; }
    public void setQhVoiChuHo(String qhVoiChuHo) { this.qhVoiChuHo = qhVoiChuHo; }
    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }
    public HoKhau getHoKhau() { return hoKhau; }
    public void setHoKhau(HoKhau hoKhau) { this.hoKhau = hoKhau; }
}
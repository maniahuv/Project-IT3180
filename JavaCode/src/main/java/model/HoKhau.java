package model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "hokhau")
public class HoKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maHoKhau;

    @Column(nullable = false)
    private Integer chuHo; // id người làm chủ hộ, thường là maNhanKhau

    @Column(nullable = false, length = 25)
    private String soNha;

    private LocalDate ngayLap;

    private LocalDate ngayCapNhat;

    @Column(nullable = false)
    private Float dienTich;

    // Quan hệ 1-n với NhanKhau (nhân khẩu trong hộ khẩu)
    @OneToMany(mappedBy = "hoKhau", cascade = CascadeType.ALL)
    private List<NhanKhau> danhSachNhanKhau;

    // Quan hệ 1-n với LichSuHoKhau
    @OneToMany(mappedBy = "hoKhau", cascade = CascadeType.ALL)
    private List<LichSuHoKhau> lichSuHoKhau;

    // Constructors
    public HoKhau() {}

    public HoKhau(Integer chuHo, String soNha, LocalDate ngayLap, LocalDate ngayCapNhat, Float dienTich) {
        this.chuHo = chuHo;
        this.soNha = soNha;
        this.ngayLap = ngayLap;
        this.ngayCapNhat = ngayCapNhat;
        this.dienTich = dienTich;
    }

    // Getters và Setters
    public Integer getMaHoKhau() {
        return maHoKhau;
    }

    public void setMaHoKhau(Integer maHoKhau) {
        this.maHoKhau = maHoKhau;
    }

    public Integer getChuHo() {
        return chuHo;
    }

    public void setChuHo(Integer chuHo) {
        this.chuHo = chuHo;
    }

    public String getSoNha() {
        return soNha;
    }

    public void setSoNha(String soNha) {
        this.soNha = soNha;
    }

    public LocalDate getNgayLap() {
        return ngayLap;
    }

    public void setNgayLap(LocalDate ngayLap) {
        this.ngayLap = ngayLap;
    }

    public LocalDate getNgayCapNhat() {
        return ngayCapNhat;
    }

    public void setNgayCapNhat(LocalDate ngayCapNhat) {
        this.ngayCapNhat = ngayCapNhat;
    }

    public Float getDienTich() {
        return dienTich;
    }

    public void setDienTich(Float dienTich) {
        this.dienTich = dienTich;
    }

    public List<NhanKhau> getDanhSachNhanKhau() {
        return danhSachNhanKhau;
    }

    public void setDanhSachNhanKhau(List<NhanKhau> danhSachNhanKhau) {
        this.danhSachNhanKhau = danhSachNhanKhau;
    }

    public List<LichSuHoKhau> getLichSuHoKhau() {
        return lichSuHoKhau;
    }

    public void setLichSuHoKhau(List<LichSuHoKhau> lichSuHoKhau) {
        this.lichSuHoKhau = lichSuHoKhau;
    }
}

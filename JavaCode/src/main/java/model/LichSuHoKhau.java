package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.time.LocalDateTime;

@Entity
@Table(name = "lichsu_hokhau")
public class LichSuHoKhau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer maLichSu;

    @Column
    private Integer loaiThayDoi;

    @Column
    private LocalDateTime thoiGian;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoKhau")
    @JsonBackReference(value = "hokhau-lichsu")
    private HoKhau hoKhau;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNhanKhau")
    private NhanKhau nhanKhau;

    // Constructors
    public LichSuHoKhau() {}

    // Getters and Setters
    public Integer getMaLichSu() { return maLichSu; }
    public void setMaLichSu(Integer maLichSu) { this.maLichSu = maLichSu; }
    public Integer getLoaiThayDoi() { return loaiThayDoi; }
    public void setLoaiThayDoi(Integer loaiThayDoi) { this.loaiThayDoi = loaiThayDoi; }
    public LocalDateTime getThoiGian() { return thoiGian; }
    public void setThoiGian(LocalDateTime thoiGian) { this.thoiGian = thoiGian; }
    public HoKhau getHoKhau() { return hoKhau; }
    public void setHoKhau(HoKhau hoKhau) { this.hoKhau = hoKhau; }
    public NhanKhau getNhanKhau() { return nhanKhau; }
    public void setNhanKhau(NhanKhau nhanKhau) { this.nhanKhau = nhanKhau; }
}
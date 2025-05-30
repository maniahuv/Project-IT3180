package model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tamtrutamvang")
public class TamTruTamVang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50)
    private String loai;

    private LocalDate ngayBatDau;

    private LocalDate ngayKetThuc;

    @Column(length = 1000)
    private String lyDo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maNhanKhau", nullable = false)
    private NhanKhau nhanKhau;

    public TamTruTamVang() {
    }

    public TamTruTamVang(String loai, LocalDate ngayBatDau, LocalDate ngayKetThuc, String lyDo, NhanKhau nhanKhau) {
        this.loai = loai;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.lyDo = lyDo;
        this.nhanKhau = nhanKhau;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLoai() {
        return loai;
    }

    public void setLoai(String loai) {
        this.loai = loai;
    }

    public LocalDate getNgayBatDau() {
        return ngayBatDau;
    }

    public void setNgayBatDau(LocalDate ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public void setNgayKetThuc(LocalDate ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public String getLyDo() {
        return lyDo;
    }

    public void setLyDo(String lyDo) {
        this.lyDo = lyDo;
    }

    public NhanKhau getNhanKhau() {
        return nhanKhau;
    }

    public void setNhanKhau(NhanKhau nhanKhau) {
        this.nhanKhau = nhanKhau;
    }
}

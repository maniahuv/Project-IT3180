package model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lichsuhokhau")
public class LichSuHoKhau {

    // Hằng số mô tả loại thay đổi
    public static final int LOAI_THEM_VAO = 1;
    public static final int LOAI_XOA_RA = 2;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "loaiThayDoi", nullable = false)
    private int loaiThayDoi;  // 1 - thêm vào hộ khẩu, 2 - xóa ra

    @Column(name = "thoiGian", nullable = false)
    private LocalDateTime thoiGian;

    // @Column(name = "noiDung", length = 1000)
    // private String noiDung;

    @ManyToOne
    @JoinColumn(name = "maHoKhau", nullable = false)
    private HoKhau hoKhau;

    @ManyToOne
    @JoinColumn(name = "maNhanKhau", nullable = true)
    private NhanKhau nhanKhau;

    // Constructors
    public LichSuHoKhau() {}

    public LichSuHoKhau(int loaiThayDoi, LocalDateTime thoiGian, String noiDung, HoKhau hoKhau, NhanKhau nhanKhau) {
        this.loaiThayDoi = loaiThayDoi;
        this.thoiGian = thoiGian;
        // this.noiDung = noiDung;
        this.hoKhau = hoKhau;
        this.nhanKhau = nhanKhau;
    }

    // Getters và setters

    public Integer getId() {
        return id;
    }

    public int getLoaiThayDoi() {
        return loaiThayDoi;
    }

    public void setLoaiThayDoi(int loaiThayDoi) {
        this.loaiThayDoi = loaiThayDoi;
    }

    public LocalDateTime getThoiGian() {
        return thoiGian;
    }

    public void setThoiGian(LocalDateTime thoiGian) {
        this.thoiGian = thoiGian;
    }

    // public String getNoiDung() {
    //     return noiDung;
    // }

    // public void setNoiDung(String noiDung) {
    //     this.noiDung = noiDung;
    // }

    public HoKhau getHoKhau() {
        return hoKhau;
    }

    public void setHoKhau(HoKhau hoKhau) {
        this.hoKhau = hoKhau;
    }

    public NhanKhau getNhanKhau() {
        return nhanKhau;
    }

    public void setNhanKhau(NhanKhau nhanKhau) {
        this.nhanKhau = nhanKhau;
    }
}

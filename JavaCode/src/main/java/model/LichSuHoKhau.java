package model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHoKhau")
    @JsonBackReference(value = "hokhau-lichsu")
    private HoKhau hoKhau;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNhanKhau")
    private NhanKhau nhanKhau;

    // Transient field to include maHoKhau in JSON response
    @Transient
    @JsonProperty("maHoKhau")
    private Integer maHoKhau;

    // Transient field to include maNhanKhau in JSON response
    @Transient
    @JsonProperty("maNhanKhau")
    private Integer maNhanKhau;

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
    public void setHoKhau(HoKhau hoKhau) { 
        this.hoKhau = hoKhau;
        // Set maHoKhau when hoKhau is set
        this.maHoKhau = (hoKhau != null) ? hoKhau.getMaHoKhau() : null;
    }
    public NhanKhau getNhanKhau() { return nhanKhau; }
    public void setNhanKhau(NhanKhau nhanKhau) { 
        this.nhanKhau = nhanKhau;
        // Set maNhanKhau when nhanKhau is set
        this.maNhanKhau = (nhanKhau != null) ? nhanKhau.getMaNhanKhau() : null;
    }
    public Integer getMaHoKhau() { 
        // Ensure maHoKhau is in sync with hoKhau
        return (hoKhau != null) ? hoKhau.getMaHoKhau() : maHoKhau; 
    }
    public void setMaHoKhau(Integer maHoKhau) { 
        this.maHoKhau = maHoKhau; 
    }
    public Integer getMaNhanKhau() { 
        // Ensure maNhanKhau is in sync with nhanKhau
        return (nhanKhau != null) ? nhanKhau.getMaNhanKhau() : maNhanKhau; 
    }
    public void setMaNhanKhau(Integer maNhanKhau) { 
        this.maNhanKhau = maNhanKhau; 
    }
}
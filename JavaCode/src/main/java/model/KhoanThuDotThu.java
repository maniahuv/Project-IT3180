package model;

import jakarta.persistence.*;

@Entity
@Table(name = "khoanthu_has_dotthu")
public class KhoanThuDotThu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idKhoanThuDotThu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maKhoanThu", nullable = false)
    private KhoanThu khoanThu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maDotThu", nullable = false)
    private DotThu dotThu;

    // Constructors
    public KhoanThuDotThu() {}

    public KhoanThuDotThu(KhoanThu khoanThu, DotThu dotThu) {
        this.khoanThu = khoanThu;
        this.dotThu = dotThu;
    }

    // Getters and Setters
    public Integer getIdKhoanThuDotThu() {
        return idKhoanThuDotThu;
    }

    public void setIdKhoanThuDotThu(Integer idKhoanThuDotThu) {
        this.idKhoanThuDotThu = idKhoanThuDotThu;
    }

    public KhoanThu getKhoanThu() {
        return khoanThu;
    }

    public void setKhoanThu(KhoanThu khoanThu) {
        this.khoanThu = khoanThu;
    }

    public DotThu getDotThu() {
        return dotThu;
    }

    public void setDotThu(DotThu dotThu) {
        this.dotThu = dotThu;
    }
}

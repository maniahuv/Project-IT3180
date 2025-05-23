package model;

import java.sql.Date;

public class DotThu {

    public enum TrangThaiDotThu {
        DANG_DIEN_RA("Đang diễn ra"),
        DA_KET_THUC("Đã kết thúc");

        private final String moTa;

        TrangThaiDotThu(String moTa) {
            this.moTa = moTa;
        }

        @Override
        public String toString() {
            return moTa;
        }
    }

    private String maDotThu;
    private String tenDotThu;
    private Date thoiGianBatDau;
    private Date thoiGianKetThuc;
    private String moTa;
    private TrangThaiDotThu trangThai;

    // Constructor đầy đủ
    public DotThu(String maDotThu, String tenDotThu, Date thoiGianBatDau, Date thoiGianKetThuc, String moTa, TrangThaiDotThu trangThai) {
        this.maDotThu = maDotThu;
        this.tenDotThu = tenDotThu;
        this.thoiGianBatDau = thoiGianBatDau;
        this.thoiGianKetThuc = thoiGianKetThuc;
        this.moTa = moTa;
        this.trangThai = trangThai;
    }

    // Getter và Setter
    public String getMaDotThu() {
        return maDotThu;
    }

    public void setMaDotThu(String maDotThu) {
        this.maDotThu = maDotThu;
    }

    public String getTenDotThu() {
        return tenDotThu;
    }

    public void setTenDotThu(String tenDotThu) {
        this.tenDotThu = tenDotThu;
    }

    public Date getThoiGianBatDau() {
        return thoiGianBatDau;
    }

    public void setThoiGianBatDau(Date thoiGianBatDau) {
        this.thoiGianBatDau = thoiGianBatDau;
    }

    public Date getThoiGianKetThuc() {
        return thoiGianKetThuc;
    }

    public void setThoiGianKetThuc(Date thoiGianKetThuc) {
        this.thoiGianKetThuc = thoiGianKetThuc;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public TrangThaiDotThu getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThaiDotThu trangThai) {
        this.trangThai = trangThai;
    }
}

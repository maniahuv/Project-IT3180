package model;

import java.util.Objects;

public class LoaiKhoanThu {

    private String maLoaiKhoanThu;
    private String tenLoai;
    private String donViTinh;
    private boolean batBuoc = true;

    public LoaiKhoanThu() {}

    public LoaiKhoanThu(String maLoaiKhoanThu, String tenLoai, String donViTinh, boolean batBuoc) {
        this.maLoaiKhoanThu = maLoaiKhoanThu;
        this.tenLoai = tenLoai;
        this.donViTinh = donViTinh;
        this.batBuoc = batBuoc;
    }

    public String getMaLoaiKhoanThu() {
        return maLoaiKhoanThu;
    }

    public void setMaLoaiKhoanThu(String maLoaiKhoanThu) {
        this.maLoaiKhoanThu = maLoaiKhoanThu;
    }

    public String getTenLoai() {
        return tenLoai;
    }

    public void setTenLoai(String tenLoai) {
        this.tenLoai = tenLoai;
    }

    public String getDonViTinh() {
        return donViTinh;
    }

    public void setDonViTinh(String donViTinh) {
        this.donViTinh = donViTinh;
    }

    public boolean isBatBuoc() {
        return batBuoc;
    }

    public void setBatBuoc(boolean batBuoc) {
        this.batBuoc = batBuoc;
    }

    @Override
    public String toString() {
        return "LoaiKhoanThu [maLoaiKhoanThu=" + maLoaiKhoanThu + ", tenLoai=" + tenLoai +
               ", donViTinh=" + donViTinh + ", batBuoc=" + batBuoc + "]";
    }

    @Override
    public int hashCode() {
        return Objects.hash(maLoaiKhoanThu, tenLoai, donViTinh, batBuoc);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        LoaiKhoanThu other = (LoaiKhoanThu) obj;
        return batBuoc == other.batBuoc &&
               Objects.equals(maLoaiKhoanThu, other.maLoaiKhoanThu) &&
               Objects.equals(tenLoai, other.tenLoai) &&
               Objects.equals(donViTinh, other.donViTinh);
    }
}

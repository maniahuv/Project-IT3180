package model;

import java.sql.Date;
import java.util.Objects;

public class NhanKhau {

    private String maNhanKhau;
    private String hoTen;
    private String soCCCD;
    private Date ngaySinh;
    private int gioiTinh;
    private String ngheNghiep;
    private String quanHeVoiChuHo;  // đổi thành String
    private String tinhTrangCuTru;  // đổi thành String
    private String maHoKhau;

    // Constructor
    public NhanKhau(String maNhanKhau, String hoTen, String soCCCD, Date ngaySinh, int gioiTinh, String ngheNghiep,
                   String quanHeVoiChuHo, String tinhTrangCuTru, String maHoKhau) {
        this.maNhanKhau = maNhanKhau;
        this.hoTen = hoTen;
        this.soCCCD = soCCCD;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.ngheNghiep = ngheNghiep;
        this.quanHeVoiChuHo = quanHeVoiChuHo;
        this.tinhTrangCuTru = tinhTrangCuTru;
        this.maHoKhau = maHoKhau;
    }

    // Getters và Setters
    public String getMaNhanKhau() {
        return maNhanKhau;
    }

    public void setMaNhanKhau(String maNhanKhau) {
        this.maNhanKhau = maNhanKhau;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getSoCCCD() {
        return soCCCD;
    }

    public void setSoCCCD(String soCCCD) {
        this.soCCCD = soCCCD;
    }

    public Date getNgaySinh() {
        return ngaySinh;
    }

    public void setNgaySinh(Date ngaySinh) {
        this.ngaySinh = ngaySinh;
    }

    public int getGioiTinh() {
        return gioiTinh;
    }

    public void setGioiTinh(int gioiTinh) {
        this.gioiTinh = gioiTinh;
    }

    public String getNgheNghiep() {
        return ngheNghiep;
    }

    public void setNgheNghiep(String ngheNghiep) {
        this.ngheNghiep = ngheNghiep;
    }

    public String getQuanHeVoiChuHo() {
        return quanHeVoiChuHo;
    }

    public void setQuanHeVoiChuHo(String quanHeVoiChuHo) {
        this.quanHeVoiChuHo = quanHeVoiChuHo;
    }

    public String getTinhTrangCuTru() {
        return tinhTrangCuTru;
    }

    public void setTinhTrangCuTru(String tinhTrangCuTru) {
        this.tinhTrangCuTru = tinhTrangCuTru;
    }

    public String getMaHoKhau() {
        return maHoKhau;
    }

    public void setMaHoKhau(String maHoKhau) {
        this.maHoKhau = maHoKhau;
    }

    @Override
    public String toString() {
        return "NhanKhau [maNhanKhau=" + maNhanKhau + ", hoTen=" + hoTen + ", soCCCD=" + soCCCD + ", ngaySinh="
                + ngaySinh + ", gioiTinh=" + gioiTinh + ", ngheNghiep=" + ngheNghiep + ", quanHeVoiChuHo="
                + quanHeVoiChuHo + ", tinhTrangCuTru=" + tinhTrangCuTru + ", maHoKhau=" + maHoKhau + "]";
    }

    @Override
    public int hashCode() {
        return Objects.hash(maNhanKhau, hoTen, soCCCD, ngaySinh, gioiTinh, ngheNghiep, quanHeVoiChuHo, tinhTrangCuTru,
                maHoKhau);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null || getClass() != obj.getClass())
            return false;
        NhanKhau other = (NhanKhau) obj;
        return Objects.equals(maNhanKhau, other.maNhanKhau) && Objects.equals(hoTen, other.hoTen)
                && Objects.equals(soCCCD, other.soCCCD) && Objects.equals(ngaySinh, other.ngaySinh)
                && gioiTinh == other.gioiTinh && Objects.equals(ngheNghiep, other.ngheNghiep)
                && Objects.equals(quanHeVoiChuHo, other.quanHeVoiChuHo) && Objects.equals(tinhTrangCuTru, other.tinhTrangCuTru)
                && Objects.equals(maHoKhau, other.maHoKhau);
    }

    // Enums (nếu bạn vẫn muốn giữ enums kiểu int để map với các giá trị int khác)
    public static class GioiTinh {
        public static final int NAM = 0;
        public static final int NU = 1;
        public static final int KHAC = 2;

        public static String toString(int vaiTro) {
            switch (vaiTro) {
                case NAM:
                    return "Nam";
                case NU:
                    return "Nữ";
                case KHAC:
                    return "Khác";
                default:
                    return "";
            }
        }
    }

    // Bạn có thể xóa hoặc giữ enums quanHeVoiChuHo và tinhTrangCuTru nếu không dùng nữa,
    // vì giờ 2 trường này đã là String
}

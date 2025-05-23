package model;

import java.sql.Date;
import java.util.Objects;

public class NhanKhau {

    private String maNhanKhau;
    private String hoTen;
    private String soCCCD;
    private Date ngaySinh;
    private GioiTinh gioiTinh;
    private String ngheNghiep;
    private QuanHeVoiChuHo quanHeVoiChuHo;
    private TinhTrangCuTru tinhTrangCuTru;
    private String maHoKhau;

    // Constructor
    public NhanKhau(String maNhanKhau, String hoTen, String soCCCD, Date ngaySinh, GioiTinh gioiTinh,
                    String ngheNghiep, QuanHeVoiChuHo quanHeVoiChuHo, TinhTrangCuTru tinhTrangCuTru, String maHoKhau) {
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
    public String getMaNhanKhau() { return maNhanKhau; }
    public void setMaNhanKhau(String maNhanKhau) { this.maNhanKhau = maNhanKhau; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getSoCCCD() { return soCCCD; }
    public void setSoCCCD(String soCCCD) { this.soCCCD = soCCCD; }

    public Date getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(Date ngaySinh) { this.ngaySinh = ngaySinh; }

    public GioiTinh getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(GioiTinh gioiTinh) { this.gioiTinh = gioiTinh; }

    public String getNgheNghiep() { return ngheNghiep; }
    public void setNgheNghiep(String ngheNghiep) { this.ngheNghiep = ngheNghiep; }

    public QuanHeVoiChuHo getQuanHeVoiChuHo() { return quanHeVoiChuHo; }
    public void setQuanHeVoiChuHo(QuanHeVoiChuHo quanHeVoiChuHo) { this.quanHeVoiChuHo = quanHeVoiChuHo; }

    public TinhTrangCuTru getTinhTrangCuTru() { return tinhTrangCuTru; }
    public void setTinhTrangCuTru(TinhTrangCuTru tinhTrangCuTru) { this.tinhTrangCuTru = tinhTrangCuTru; }

    public String getMaHoKhau() { return maHoKhau; }
    public void setMaHoKhau(String maHoKhau) { this.maHoKhau = maHoKhau; }

    @Override
    public String toString() {
        return "NhanKhau [maNhanKhau=" + maNhanKhau + ", hoTen=" + hoTen + ", soCCCD=" + soCCCD + ", ngaySinh=" + ngaySinh +
                ", gioiTinh=" + gioiTinh + ", ngheNghiep=" + ngheNghiep + ", quanHeVoiChuHo=" + quanHeVoiChuHo +
                ", tinhTrangCuTru=" + tinhTrangCuTru + ", maHoKhau=" + maHoKhau + "]";
    }

    @Override
    public int hashCode() {
        return Objects.hash(maNhanKhau, hoTen, soCCCD, ngaySinh, gioiTinh, ngheNghiep, quanHeVoiChuHo, tinhTrangCuTru, maHoKhau);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        NhanKhau other = (NhanKhau) obj;
        return Objects.equals(maNhanKhau, other.maNhanKhau) &&
               Objects.equals(hoTen, other.hoTen) &&
               Objects.equals(soCCCD, other.soCCCD) &&
               Objects.equals(ngaySinh, other.ngaySinh) &&
               gioiTinh == other.gioiTinh &&
               Objects.equals(ngheNghiep, other.ngheNghiep) &&
               quanHeVoiChuHo == other.quanHeVoiChuHo &&
               tinhTrangCuTru == other.tinhTrangCuTru &&
               Objects.equals(maHoKhau, other.maHoKhau);
    }

    // Enums
    public enum GioiTinh {
        NAM("Nam"),
        NU("Nữ"),
        KHAC("Khác");

        private final String hienThi;
        GioiTinh(String hienThi) { this.hienThi = hienThi; }
        @Override public String toString() { return hienThi; }
    }

    public enum QuanHeVoiChuHo {
        CHU_HO("Chủ hộ"),
        VO_CHONG("Vợ/Chồng"),
        CON("Con"),
        CHA_ME("Cha/Mẹ"),
        ANH_CHI_EM("Anh/Chị/Em"),
        KHAC("Khác");

        private final String moTa;
        QuanHeVoiChuHo(String moTa) { this.moTa = moTa; }
        @Override public String toString() { return moTa; }
    }

    public enum TinhTrangCuTru {
        DANG_O("Đang ở"),
        TAM_VANG("Tạm vắng");

        private final String moTa;
        TinhTrangCuTru(String moTa) { this.moTa = moTa; }
        @Override public String toString() { return moTa; }
    }
}

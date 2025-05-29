package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.NhanKhau;
import utils.DataAccessObject;

public class NhanKhauDao extends DataAccessObject<NhanKhau> {

    public static NhanKhauDao instance = new NhanKhauDao();

    public static NhanKhauDao getInstance() {
        return instance;
    }

    private NhanKhauDao() {
        super("ID", "NhanKhau");
    }

    @Override
    public int insert(NhanKhau t) {
        int ketQua = 0;
        String sql = "INSERT INTO NhanKhau (ID, HoTen, SoCCCD, NgaySinh, GioiTinh, NgheNghiep, QuanHeVoiChuHo, TinhTrangCuTru, MaHoKhau) VALUES (?,?,?,?,?,?,?,?,?)";
        try (Connection conn = JDBCUtil.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, t.getMaNhanKhau());
            pst.setString(2, t.getHoTen());
            pst.setString(3, t.getSoCCCD());
            pst.setDate(4, t.getNgaySinh());
            pst.setInt(5, t.getGioiTinh());
            pst.setString(6, t.getNgheNghiep());
            pst.setString(7, t.getQuanHeVoiChuHo());  // sửa thành setString
            pst.setString(8, t.getTinhTrangCuTru());  // sửa thành setString
            pst.setString(9, t.getMaHoKhau());

            ketQua = pst.executeUpdate();
            System.out.println("Có " + ketQua + " dòng thay đổi");

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ketQua;
    }

    public int update(NhanKhau t) {
        int ketQua = 0;
        String sql = "UPDATE NhanKhau SET HoTen=?, SoCCCD=?, NgaySinh=?, GioiTinh=?, NgheNghiep=?, QuanHeVoiChuHo=?, TinhTrangCuTru=?, MaHoKhau=? WHERE ID=?";
        try (Connection conn = JDBCUtil.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, t.getHoTen());
            pst.setString(2, t.getSoCCCD());
            pst.setDate(3, t.getNgaySinh());
            pst.setInt(4, t.getGioiTinh());
            pst.setString(5, t.getNgheNghiep());
            pst.setString(6, t.getQuanHeVoiChuHo());  // sửa thành setString
            pst.setString(7, t.getTinhTrangCuTru());  // sửa thành setString
            pst.setString(8, t.getMaHoKhau());
            pst.setString(9, t.getMaNhanKhau());

            ketQua = pst.executeUpdate();
            System.out.println("Cập nhật " + ketQua + " dòng");

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ketQua;
    }

    public int delete(String id) {
        int ketQua = 0;
        String sql = "DELETE FROM NhanKhau WHERE ID=?";
        try (Connection conn = JDBCUtil.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, id);
            ketQua = pst.executeUpdate();
            System.out.println("Xóa " + ketQua + " dòng");

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return ketQua;
    }

    public NhanKhau findById(String id) {
        String sql = "SELECT * FROM NhanKhau WHERE ID=?";
        try (Connection conn = JDBCUtil.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql)) {

            pst.setString(1, id);
            try (ResultSet rs = pst.executeQuery()) {
                if (rs.next()) {
                    return newFromResultSet(rs);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<NhanKhau> findAll() {
        List<NhanKhau> list = new ArrayList<>();
        String sql = "SELECT * FROM NhanKhau";
        try (Connection conn = JDBCUtil.getConnection();
             PreparedStatement pst = conn.prepareStatement(sql);
             ResultSet rs = pst.executeQuery()) {

            while (rs.next()) {
                list.add(newFromResultSet(rs));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public NhanKhau newFromResultSet(ResultSet rs) throws SQLException {
        return new NhanKhau(
                rs.getString("ID"),
                rs.getString("HoTen"),
                rs.getString("SoCCCD"),
                rs.getDate("NgaySinh"),
                rs.getInt("GioiTinh"),
                rs.getString("NgheNghiep"),
                rs.getString("QuanHeVoiChuHo"),     // sửa thành getString
                rs.getString("TinhTrangCuTru"),     // sửa thành getString
                rs.getString("MaHoKhau")
        );
    }
}

package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.TaiKhoan.VaiTro;
import model.NhanKhau;

public class NhanKhauDao extends DataAccessObject<NhanKhau> {

	public static NhanKhauDao instance = new NhanKhauDao();

	public NhanKhauDao() {
		super("NhanKhau");
	}

	@Override
	public int insert(NhanKhau t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO ChangeLog (ID,HoTen,SoCCCD,NgaySinh,GioiTinh,NgheNghiep,QuanHeVoiChuHo,TinhTrangCuTru,MaHoKhau) VALUES (?,?,?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaNhanKhau());
			pst.setString(2, t.getHoTen());
			pst.setString(3, t.getSoCCCD());
			pst.setDate(4, t.getNgaySinh());
			pst.setString(5, t.getGioiTinh().toString());
			pst.setString(6, t.getNgheNghiep());
			pst.setString(7, t.getQuanHeVoiChuHo().toString());
			pst.setString(8, t.getTinhTrangCuTru().toString());
			pst.setString(9, t.getMaHoKhau());

			ketQua = pst.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return ketQua;
	}

	@Override
	public NhanKhau newFromResultSet(ResultSet rs) throws SQLException {
		return new NhanKhau(rs.getString("ID"), rs.getString("HoTen"), rs.getString("SoCCCD"), rs.getDate("NgaySinh"),
				rs.getString("GioiTinh"), rs.getString("NgheNghiep"), rs.getString("QuanHeVoiChuHo"),
				rs.getBoolean("TinhTrangCuTru"), rs.getBoolean("MaHoKhau"));
	}

}

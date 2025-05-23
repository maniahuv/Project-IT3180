package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.TaiKhoan;
import model.TaiKhoan.VaiTro;

public class TaiKhoanDao extends DataAccessObject<TaiKhoan> {

	public static TaiKhoanDao instance = new TaiKhoanDao();

	public TaiKhoanDao() {
		super("TaiKhoan");
	}

	@Override
	public int insert(TaiKhoan t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO ChangeLog (ID,Email,MatKhau,TenNguoiDung,SoDienThoai,VaiTro,MaNhanKhau,TrangThai) VALUES (?,?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaTaiKhoan());
			pst.setString(2, t.getEmail());
			pst.setString(3, t.getMatKhau());
			pst.setString(4, t.getTenNguoiDung());
			pst.setString(5, t.getSoDienThoai());
			pst.setString(6, t.getVaiTro().toString());
			pst.setString(7, t.getMaNhanKhau());
			pst.setBoolean(8, t.isTrangThai());

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
	public TaiKhoan newFromResultSet(ResultSet rs) throws SQLException {
		return new TaiKhoan(rs.getString("ID"), rs.getString("Email"), rs.getString("MatKhau"),
				rs.getString("TenNguoiDung"), rs.getString("SoDienThoai"), VaiTro.get(rs.getString("VaiTro")),
				rs.getString("MaNhanKhau"), rs.getBoolean("TrangThai"));
	}

}

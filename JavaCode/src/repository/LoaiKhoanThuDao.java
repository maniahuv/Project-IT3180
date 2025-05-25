package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.JDBCUtil;
import model.LoaiKhoanThu;
import utils.DataAccessObject;

public class LoaiKhoanThuDao extends DataAccessObject<LoaiKhoanThu> {

	public static LoaiKhoanThuDao instance = new LoaiKhoanThuDao();

	public LoaiKhoanThuDao() {
		super("LKT", "LoaiKhoanThu");
	}

	@Override
	public int insert(LoaiKhoanThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO LoaiKhoanThu (ID,TenLoai,DonViTinh,BatBuoc) VALUES (?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaLoaiKhoanThu());
			pst.setString(2, t.getTenLoai());
			pst.setString(3, t.getDonViTinh());
			pst.setBoolean(4, t.isBatBuoc());

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
	public LoaiKhoanThu newFromResultSet(ResultSet rs) throws SQLException {
		return new LoaiKhoanThu(rs.getString("ID"), rs.getString("TenLoai"), rs.getString("DonViTinh"),
				rs.getBoolean("BatBuoc"));
	}

}

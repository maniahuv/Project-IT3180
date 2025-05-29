package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.JDBCUtil;
import model.LichSuGiaoDich;
import utils.DataAccessObject;

public class LichSuGiaoDichDao extends DataAccessObject<LichSuGiaoDich> {

	public static LichSuGiaoDichDao instance = new LichSuGiaoDichDao();

	public LichSuGiaoDichDao() {
		super("LS", "LichSuGiaoDich");
	}

	@Override
	public int insert(LichSuGiaoDich t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO LichSuGiaoDich (ID,ThoiGian,HanhDong,MaTaiKhoan,DoiTuongLienQuan,MoTaChiTiet) VALUES (?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaLichSu());
			pst.setDate(2, t.getThoiGian());
			pst.setString(3, t.getHanhDong());
			pst.setString(4, t.getMaTaiKhoan());
			pst.setString(5, t.getDoiTuongLienQuan());
			pst.setString(6, t.getMoTaChiTiet());

			ketQua = pst.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			System.err.println("Failed to record history.");
			return 0;
		}
		return ketQua;
	}

	@Override
	public LichSuGiaoDich newFromResultSet(ResultSet rs) throws SQLException {
		return new LichSuGiaoDich(rs.getString("ID"), rs.getDate("ThoiGian"), rs.getString("HanhDong"),
				rs.getString("MaTaiKhoan"), rs.getString("DoiTuongLienQuan"), rs.getString("MoTaChiTiet"));
	}

}

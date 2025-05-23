package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.TamTruTamVang;

public class TamTruTamVangDao extends DataAccessObject<TamTruTamVang> {

	public static TamTruTamVangDao instance = new TamTruTamVangDao();

	public TamTruTamVangDao() {
		super("TamTruTamVang");
	}

	@Override
	public int insert(TamTruTamVang t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO TamTruTamVang (ID,MaNhanKhau,Loai,NoiTamTruTamVang,TuNgay,DenNgay) VALUES (?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaTamTruTamVang());
			pst.setString(2, t.getMaNhanKhau());
			pst.setString(3, t.getLoai());
			pst.setString(4, t.getNoiTamTruTamVang());
			pst.setDate(5, t.getTuNgay());
			pst.setDate(6, t.getDenNgay());

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
	public TamTruTamVang newFromResultSet(ResultSet rs) throws SQLException {
		return new TamTruTamVang(rs.getString("ID"), rs.getString("MaNhanKhau"), rs.getString("Loai"),
				rs.getString("NoiTamTruTamVang"), rs.getDate("TuNgay"), rs.getDate("DenNgay"));
	}

}

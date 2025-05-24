package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.KhoanThu;

public class KhoanThuDao extends DataAccessObject<KhoanThu> {

	public static KhoanThuDao instance = new KhoanThuDao();

	public KhoanThuDao() {
		super("KhoanThu");
	}

	@Override
	public int insert(KhoanThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO KhoanThu (ID,MaDotThu,MaHoKhau,MaLoaiKHoanThu,SoTienPhaiNop,TrangThaiThanhToan,NgayNop) VALUES (?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaKhoanThu());
			pst.setString(2, t.getMaDotThu());
			pst.setString(3, t.getMaHoKhau());
			pst.setString(4, t.getMaLoaiKHoanThu());
			pst.setDouble(5, t.getSoTienPhaiNop());
			pst.setInt(6, t.getTrangThaiThanhToan());
			pst.setDate(7, t.getNgayNop());

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
	public KhoanThu newFromResultSet(ResultSet rs) throws SQLException {
		return new KhoanThu(rs.getString("ID"), rs.getString("MaDotThu"), rs.getString("MaHoKhau"),
				rs.getString("MaLoaiKHoanThu"), rs.getDouble("SoTienPhaiNop"), rs.getInt("TrangThaiThanhToan"),
				rs.getDate("NgayNop"));
	}

}

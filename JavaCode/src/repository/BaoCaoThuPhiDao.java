package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.BaoCaoThuPhi;

public class BaoCaoThuPhiDao extends DataAccessObject<BaoCaoThuPhi> {

	public static BaoCaoThuPhiDao instance = new BaoCaoThuPhiDao();

	public BaoCaoThuPhiDao() {
		super("BaoCaoThuPhi");
	}

	@Override
	public int insert(BaoCaoThuPhi t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO BaoCaoThuPhi (ID,TieuDe,NgayTao,MaTaiKhoan,MaDotThu,DuLieuTongHop,DuongDanFile) VALUES (?,?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaBaoCao());
			pst.setString(2, t.getTieuDe());
			pst.setDate(3, t.getNgayTao());
			pst.setString(4, t.getMaTaiKhoan());
			pst.setString(5, t.getMaDotThu());
			pst.setString(6, t.getDuLieuTongHop());
			pst.setString(7, t.getDuongDanFile());

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
	public BaoCaoThuPhi newFromResultSet(ResultSet rs) throws SQLException {
		return new BaoCaoThuPhi(rs.getString("ID"), rs.getString("TieuDe"), rs.getDate("NgayTao"),
				rs.getString("MaTaiKhoan"), rs.getString("MaDotThu"), rs.getString("DuLieuTongHop"),
				rs.getString("DuongDanFile"));
	}

}

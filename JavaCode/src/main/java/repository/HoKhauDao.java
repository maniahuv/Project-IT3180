package repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import database.JDBCUtil;
import model.HoKhau;
import model.ThongKeHoKhau;
import utils.DataAccessObject;

public class HoKhauDao extends DataAccessObject<HoKhau> {

	public static HoKhauDao instance = new HoKhauDao();

	public HoKhauDao() {
		super("HK", "HoKhau");
	}

	@Override
	public int insert(HoKhau t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO HoKhau (ID,SoCanHo,DienTich,SoNguoi,ChuHo) VALUES (?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaHoKhau());
			pst.setString(2, t.getSoCanHo());
			pst.setDouble(3, t.getDienTich());
			pst.setInt(4, t.getSoNguoi());
			pst.setString(5, t.getChuHo());

			ketQua = pst.executeUpdate();
			System.out.println("Có " + ketQua + " dòng thay đổi");

			// Ngat ket noi
			JDBCUtil.closeConnetion(conn);
		} catch (SQLException e) {
			System.err.println(String.format("Failed to update %s", name));
			return 0;
		}
		return ketQua;
	}

	@Override
	public HoKhau newFromResultSet(ResultSet rs) throws SQLException {
		return new HoKhau(rs.getString("ID"), rs.getString("SoCanHo"), rs.getDouble("DienTich"), rs.getInt("SoNguoi"),
				rs.getString("ChuHo"));
	}

	/**
	 * Thống kê: tổng số khoan thu; số đã đóng (trang_thai=1); số chưa đóng
	 * (trang_thai=0); số quá hạn chưa đóng.
	 */
	public ThongKeHoKhau thongKe() {
		String sql = "SELECT " + name + " SUM(DienTich) AS tongDienTich, " + " SUM(SoNguoi) AS tongSoNguoi, "
				+ "FROM KhoanThu";

		try (Connection conn = JDBCUtil.getConnection();
				PreparedStatement pst = conn.prepareStatement(sql);
				ResultSet rs = pst.executeQuery()) {
			if (rs.next()) {
				return new ThongKeHoKhau(rs.getInt("da_thanh_toan"), rs.getInt("chua_thanh_toan"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return new ThongKeHoKhau(0, 0);
	}

}

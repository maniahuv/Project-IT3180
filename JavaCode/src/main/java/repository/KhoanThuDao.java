package repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.KhoanThu;
import model.ThongKeKhoanThu;
import utils.DataAccessObject;
import utils.JDBCUtil;

public class KhoanThuDao extends DataAccessObject<KhoanThu> {

	public static KhoanThuDao instance = new KhoanThuDao();

	public KhoanThuDao() {
		super("KT", "KhoanThu");
	}

	@Override
	public int insert(KhoanThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO KhoanThu (ID,MaDotThu,SoTienPhaiNop,NgayNop,TenKhoanThu) VALUES (?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaKhoanThu());
			pst.setString(2, t.getMaDotThu());
			pst.setDouble(3, t.getSoTienPhaiNop());
			pst.setDate(4, t.getNgayNop());
			pst.setString(5, t.getTenKhoanThu());

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
	public KhoanThu newFromResultSet(ResultSet rs) throws SQLException {
		return new KhoanThu(rs.getString("ID"), rs.getString("MaDotThu"), rs.getDouble("SoTienPhaiNop"),
				rs.getDate("NgayNop"), rs.getString("TenKhoanThu"));
	}

	/**
	 * Tìm KhoanThu theo các tiêu chí: maHoKhau, maDotThu, trangThai (0/1), khoảng
	 * ngày nộp.
	 */
	public List<KhoanThu> timTheoTieuChi(String maDotThu, Date tuNgay, Date denNgay, String orderBy, boolean asc,
			int limit, int offset) {
		List<KhoanThu> list = new ArrayList<>();
		StringBuilder sql = new StringBuilder("SELECT * FROM KhoanThu WHERE 1=1");
		List<Object> params = new ArrayList<>();

		if (maDotThu != null) {
			sql.append(" AND MaDotThu = ?");
			params.add(maDotThu);
		}
		if (tuNgay != null) {
			sql.append(" AND NgayNop >= ?");
			params.add(tuNgay);
		}
		if (denNgay != null) {
			sql.append(" AND NgayNop <= ?");
			params.add(denNgay);
		}
		if (orderBy != null) {
			sql.append(" ORDER BY ").append(orderBy).append(asc ? " ASC" : " DESC");
		}
		if (limit > 0) {
			sql.append(" LIMIT ?");
			params.add(limit);
			if (offset >= 0) {
				sql.append(" OFFSET ?");
				params.add(offset);
			}
		}

		try (Connection conn = JDBCUtil.getConnection();
				PreparedStatement pst = conn.prepareStatement(sql.toString())) {
			for (int i = 0; i < params.size(); i++) {
				pst.setObject(i + 1, params.get(i));
			}
			try (ResultSet rs = pst.executeQuery()) {
				while (rs.next()) {
					list.add(newFromResultSet(rs));
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	}

	/**
	 * Thống kê: tổng số khoan thu; số đã đóng (trang_thai=1); số chưa đóng
	 * (trang_thai=0); số quá hạn chưa đóng.
	 */
	@Deprecated
	public ThongKeKhoanThu thongKe() {
		String sql = "SELECT " + name + " COUNT(*) AS total, "
				+ " SUM(CASE WHEN TrangThaiThanhToan=1 THEN 1 ELSE 0 END) AS da_thanh_toan, "
				+ " SUM(CASE WHEN TrangThaiThanhToan=0 THEN 1 ELSE 0 END) AS chua_thanh_toan, "
				+ " SUM(CASE WHEN TrangThaiThanhToan=0 AND NgayNop < CURRENT_DATE THEN 1 ELSE 0 END) AS qua_han_chua_thanh_toan "
				+ "FROM KhoanThu";

		try (Connection conn = JDBCUtil.getConnection();
				PreparedStatement pst = conn.prepareStatement(sql);
				ResultSet rs = pst.executeQuery()) {
			if (rs.next()) {
				return new ThongKeKhoanThu(rs.getInt("total"), rs.getInt("da_thanh_toan"), rs.getInt("chua_thanh_toan"),
						rs.getInt("qua_han_chua_thanh_toan"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return new ThongKeKhoanThu(0, 0, 0, 0);
	}

}

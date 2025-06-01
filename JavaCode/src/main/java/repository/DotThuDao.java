package repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import model.DotThu;
import model.ThongKeDotThu;
import utils.DataAccessObject;
import utils.JDBCUtil;

public class DotThuDao extends DataAccessObject<DotThu> {

	public static DotThuDao instance = new DotThuDao();

	public DotThuDao() {
		super("DT", "DotThu");
	}

	@Override
	public int insert(DotThu t) {
		int ketQua = 0;
		try {
			// Tao ket noi
			Connection conn = JDBCUtil.getConnection();

			// Thuc thi lenh sql
			String sql = "INSERT INTO DotThu (ID,TenDotThu,ThoiGianBatDau,ThoiGianKetThuc,MoTa,TrangThai) VALUES (?,?,?,?,?,?)";

			// Tao statement
			PreparedStatement pst = conn.prepareStatement(sql);
			pst.setString(1, t.getMaDotThu());
			pst.setString(2, t.getTenDotThu());
			pst.setDate(3, t.getThoiGianBatDau());
			pst.setDate(4, t.getThoiGianKetThuc());
			pst.setString(5, t.getMoTa());
			pst.setInt(6, t.getTrangThai());

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
	public DotThu newFromResultSet(ResultSet rs) throws SQLException {
		return new DotThu(rs.getString("ID"), rs.getString("TenDotThu"), rs.getDate("ThoiGianBatDau"),
				rs.getDate("ThoiGianKetThuc"), rs.getString("MoTa"), rs.getInt("TrangThai"));
	}

	public int updateDotThu(DotThu dt) {
		String[] cols = { "TenDotThu", "ThoiGianBatDau", "ThoiGianKetThuc", "MoTa", "TrangThai" };
		Object[] vals = { dt.getTenDotThu(), dt.getThoiGianBatDau(), dt.getThoiGianKetThuc(), dt.getMoTa(),
				dt.getTrangThai() };

		return update(dt.getMaDotThu(), cols, vals);
	}

	// tim dot thu theo tieu chi
	public List<DotThu> timDotThuTheoTieuChi(String tenDotThu, String moTa, Date tuNgay, Date denNgay, String trangThai,
			String orderBy, boolean asc, int limit, int offset) {
		List<DotThu> results = new ArrayList<>();
		StringBuilder sql = new StringBuilder("SELECT * FROM ").append("DotThu").append(" WHERE 1=1");
		List<Object> params = new ArrayList<>();

		if (tenDotThu != null && !tenDotThu.isBlank()) {
			sql.append(" AND TenDotThu ILIKE ?");
			params.add("%" + tenDotThu + "%");
		}
		if (moTa != null && !moTa.isBlank()) {
			sql.append(" AND MoTa ILIKE ?");
			params.add("%" + moTa + "%");
		}
		if (tuNgay != null) {
			sql.append(" AND ThoiGianBatDau >= ?");
			params.add(tuNgay);
		}
		if (denNgay != null) {
			sql.append(" AND ThoiGianKetThuc <= ?");
			params.add(denNgay);
		}
		if (trangThai != null) {
			int trangThaiInt = Integer.parseInt(trangThai);
			sql.append(" AND TrangThai = ?");

			params.add(trangThaiInt);
		}

		// Sắp xếp
		if (orderBy != null && !orderBy.isBlank()) {
			sql.append(" ORDER BY ").append(orderBy).append(asc ? " ASC" : " DESC");
		}

		// Phân trang
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

			// Gán tham số tuần tự
			for (int i = 0; i < params.size(); i++) {
				pst.setObject(i + 1, params.get(i));
			}

			try (ResultSet rs = pst.executeQuery()) {
				while (rs.next()) {
					DotThu dt = new DotThu(rs.getString("MaDotThu"), rs.getString("TenDotThu"),
							rs.getDate("ThoiGianBatDau"), rs.getDate("ThoiGianKetThuc"), rs.getString("MoTa"),
							rs.getInt("TrangThai"));
					results.add(dt);
				}
			}
		} catch (SQLException ex) {
			ex.printStackTrace();
		}

		return results;
	}

	//// Thong ke dot thu de tao bao cao
	public ThongKeDotThu thongKeDotThu() {
		String sql = "SELECT " + name + "  COUNT(*) AS total, "
				+ "  SUM(CASE WHEN TrangThai=0 THEN 1 ELSE 0 END) AS DangDienRa, "
				+ "  SUM(CASE WHEN TrangThai=1 THEN 1 ELSE 0 END) AS DaDienRa" + "FROM DotThu";

		try (Connection conn = JDBCUtil.getConnection();
				PreparedStatement pst = conn.prepareStatement(sql);
				ResultSet rs = pst.executeQuery()) {

			if (rs.next()) {
				int total = rs.getInt("total");
				int dang = rs.getInt("DangDienRa");
				int ketThuc = rs.getInt("DaDienRa");
				return new ThongKeDotThu(total, dang, ketThuc);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		// Nếu lỗi hoặc không có dữ liệu, trả về 0
		return new ThongKeDotThu(0, 0, 0);
	}
}

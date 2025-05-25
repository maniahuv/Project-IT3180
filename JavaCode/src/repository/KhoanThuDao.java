package repository;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import database.JDBCUtil;
import model.KhoanThu;
import model.ThongKeKhoanThu;
import utils.DataAccessObject;

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
	

	    /** 
	     * Tìm KhoanThu theo các tiêu chí: maHoKhau, maDotThu, trangThai (0/1), khoảng ngày nộp.
	     */
	    public List<KhoanThu> timTheoTieuChi(
	            String maHoKhau,
	            String maDotThu,
	            Integer trangThai,
	            Date tuNgay,
	            Date denNgay,
	            String orderBy,
	            boolean asc,
	            int limit,
	            int offset
	    ) {
	        List<KhoanThu> list = new ArrayList<>();
	        StringBuilder sql = new StringBuilder("SELECT * FROM KhoanThu WHERE 1=1");
	        List<Object> params = new ArrayList<>();

	        if (maHoKhau != null) {
	            sql.append(" AND MaHoKhau = ?");
	            params.add(maHoKhau);
	        }
	        if (maDotThu != null) {
	            sql.append(" AND MaDotThu = ?");
	            params.add(maDotThu);
	        }
	        if (trangThai != null) {
	            sql.append(" AND TrangThaiThanhToan = ?");
	            params.add(trangThai);
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
	                pst.setObject(i+1, params.get(i));
	            }
	            try (ResultSet rs = pst.executeQuery()) {
	            	while (rs.next()) {
	            		list.add(new KhoanThu(
	                            rs.getString("ID"),
	                            rs.getString("MaDotThu"),
	                            rs.getString("MaHoKhau"),
	                            rs.getString("MaLoaiKhoanThu"),
	                            rs.getDouble("SoTienPhaiNop"),
	                            rs.getInt("TrangThaiThanhToan"),
	                            rs.getDate("NgayNop")       
	                        ));
	                }
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return list;
	    }

	    /**
	     * Thống kê: tổng số khoan thu; số đã đóng (trang_thai=1);
	     * số chưa đóng (trang_thai=0); số quá hạn chưa đóng.
	     */
	    public ThongKeKhoanThu thongKe() {
	        String sql =
	            "SELECT " +
	            " COUNT(*) AS total, " +
	            " SUM(CASE WHEN trang_thai_thanh_toan=1 THEN 1 ELSE 0 END) AS da_thanh_toan, " +
	            " SUM(CASE WHEN trang_thai_thanh_toan=0 THEN 1 ELSE 0 END) AS chua_thanh_toan, " +
	            " SUM(CASE WHEN trang_thai_thanh_toan=0 AND ngay_nop < CURRENT_DATE THEN 1 ELSE 0 END) AS qua_han_chua_thanh_toan " +
	            "FROM KhoanThu";

	        try (Connection conn = JDBCUtil.getConnection();
	             PreparedStatement pst = conn.prepareStatement(sql);
	             ResultSet rs = pst.executeQuery()) {
	            if (rs.next()) {
	                return new ThongKeKhoanThu(
	                    rs.getInt("total"),
	                    rs.getInt("da_thanh_toan"),
	                    rs.getInt("chua_thanh_toan"),
	                    rs.getInt("qua_han_chua_thanh_toan")
	                );
	            }
	        } catch (SQLException e) {
	            e.printStackTrace();
	        }
	        return new ThongKeKhoanThu(0,0,0,0);
	    }
	
}

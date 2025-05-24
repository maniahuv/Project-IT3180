package service;


import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import dao.DataAccessObject;
import database.JDBCUtil;
import model.DotThu;
import model.KhoanThu;
import model.ThongKeDotThu;
import model.ThongKeKhoanThu;
import repository.KhoanThuDao;


public class KhoanThuSevice {
	private KhoanThuDao khoanThuDao;
	public KhoanThuSevice() {
        this.khoanThuDao = KhoanThuDao.instance;
    }
	public boolean themMoi (KhoanThu duLieu) {
		if (duLieu == null || duLieu.getMaDotThu() == null || duLieu.getMaDotThu() == null || duLieu.getMaHoKhau()==null || duLieu.getMaLoaiKHoanThu()==null||duLieu.getNgayNop()==null) {
            return false;
        }
		return khoanThuDao.insert(duLieu) >0;
	}
	public boolean xoa (String maKhoanThu) {
		if (maKhoanThu == null ) return false;
		return khoanThuDao.delete(maKhoanThu)>0;
	}
	public boolean capNhat (KhoanThu duLieu) {
		if (duLieu == null || duLieu.getMaKhoanThu() == null) {
            return false;
        }

        String[] fields = {"MaDotThu","MaHoKhau","MaLoaiKHoanThu","SoTienPhaiNop","TrangThaiThanhToan","NgayNop"};
        Object[] values = {
                duLieu.getMaDotThu(),
                duLieu.getMaHoKhau(),
                duLieu.getMaLoaiKHoanThu(),
                duLieu.getSoTienPhaiNop(),
                duLieu.getTrangThaiThanhToan(),
                duLieu.getNgayNop()
        };

        return khoanThuDao.update(duLieu.getMaKhoanThu(), fields, values) > 0;
    }
	public KhoanThu layThongTin(String maDotThu) {
        return khoanThuDao.selectByID(maDotThu);
    }
	//tim dot thu theo tieu chi
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
        return khoanThuDao.timTheoTieuChi(
            maHoKhau, maDotThu, trangThai, tuNgay, denNgay, orderBy, asc, limit, offset
        );
    }
		
		
	
	//Thong ke dot = tao bao cao
	public ThongKeKhoanThu thongKeKhoanThu() {
        return khoanThuDao.thongKe();
    }
	

}

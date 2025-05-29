package controller;

import java.sql.Date;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import model.NhanKhau;
import repository.NhanKhauDao;
import service.NhanKhauService;

@RestController
public class QuanLiNhanKhauController {

	@PostMapping("/tao-nhan-khau")
	public String taoTaiKhoan(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("CREATE");
		if (NhanKhauService.taoNhanKhauMoi("Admin",
				new NhanKhau(NhanKhauDao.instance.generateID(), newTr.get(1), newTr.get(2), Date.valueOf(newTr.get(3)),
						Integer.parseInt(newTr.get(4)), newTr.get(5), 0, Integer.parseInt(newTr.get(7))))) {
			System.out.println("Tao tai khoan thanh cong");
		} else {
			System.out.println("Tao tai khoan that bai");
		}
		return "QuanLiNhanKhau";
	}

	@PostMapping("/save-nhan-khau")
	public String luuTaiKhoan(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("SAVE");
		if (NhanKhauService.capNhatThongTin("Admin",
				new NhanKhau(newTr.get(0), newTr.get(1), newTr.get(2), Date.valueOf(newTr.get(3)),
						Integer.parseInt(newTr.get(4)), newTr.get(5), 0, Integer.parseInt(newTr.get(7))))) {
			System.out.println("Luu tai khoan thanh cong");
		} else {
			System.out.println("Luu tai khoan that bai");
		}
		return "QuanLiNhanKhau";
	}

	@PostMapping("/xoa-nhan-khau")
	public String xoaNhanKhau(@RequestBody String id) {
		System.out.println(String.format("Delete %s", id));
		if (NhanKhauService.xoaNhanKhau("Admin", id)) {
			System.out.println("Xoa tai khoan thanh cong");
		} else {
			System.out.println("Xoa tai khoan that bai");
		}
		return "QuanLiNhanKhau";
	}

	@GetMapping("/get-nhan-khau")
	public List<NhanKhau> getAllNhanKhau() {
		System.out.println("LOAD");
		return NhanKhauDao.instance.selectAll();
	}

}

package controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import model.TaiKhoan;
import model.TaiKhoan.VaiTro;
import repository.TaiKhoanDao;
import service.TaiKhoanService;

@RestController
public class QuanLiTaiKhoanController {

	@PostMapping("/tao-tai-khoan")
	public String taoTaiKhoan(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("CREATE");
		if (TaiKhoanService.taoTaiKhoanMoi(new TaiKhoan(TaiKhoanDao.instance.generateID(), newTr.get(1), newTr.get(2),
				newTr.get(3), newTr.get(4), VaiTro.TO_TRUONG, newTr.get(6), true))) {
			System.out.println("Tao tai khoan thanh cong");
		} else {
			System.out.println("Tao tai khoan that bai");
		}
		return "manHinhQuanLiTaiKhoan";
	}

	@PostMapping("/save-tai-khoan")
	public String luuTaiKhoan(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("SAVE");
		if (TaiKhoanService.capNhatThongTin(new TaiKhoan(newTr.get(0), newTr.get(1), "111111", newTr.get(3),
				newTr.get(4), VaiTro.TO_TRUONG, newTr.get(6), true))) {
			System.out.println("Luu tai khoan thanh cong");
		} else {
			System.out.println("Luu tai khoan that bai");
		}
		return "manHinhQuanLiTaiKhoan";
	}

	@PostMapping("/xoa-tai-khoan")
	public String xoaTaiKhoan(@RequestBody String id) {
		System.out.println(String.format("Delete %s", id));
		if (TaiKhoanService.xoaTaiKhoan(id)) {
			System.out.println("Xoa tai khoan thanh cong");
		} else {
			System.out.println("Xoa tai khoan that bai");
		}
		return "manHinhQuanLiTaiKhoan";
	}

	@GetMapping("/get-tai-khoan")
	public List<TaiKhoan> getAllTaiKhoan() {
		System.out.println("LOAD");
		return TaiKhoanDao.instance.selectAll();
	}

}

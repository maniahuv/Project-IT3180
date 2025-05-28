package controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import model.TaiKhoan;
import model.TaiKhoan.VaiTro;
import service.TaiKhoanService;

@RestController
public class DangNhapController {

	@PostMapping("/dang-nhap")
	public String taoTaiKhoan(@RequestBody List<String> newTr) {
		for (String x : newTr) {
			System.out.printf("%s - ", x);
		}
		System.out.println("CREATE");
		if (TaiKhoanService.taoTaiKhoanMoi(new TaiKhoan(newTr.get(0), "test@gmail.com", "111111", "No Name",
				"0000000000", VaiTro.TO_TRUONG, "0", true))) {
			System.out.println("Tao tai khoan thanh cong");
		} else {
			System.out.println("Tao tai khoan that bai");
		}
		return "manHinhQuanLiTaiKhoan";
	}

}

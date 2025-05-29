package controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import model.TaiKhoan;
import repository.TaiKhoanDao;
import service.TaiKhoanService;

@Controller
public class DangKiController {

	@PostMapping("/dang-ki")
	public String taoTaiKhoan(@ModelAttribute("taiKhoan") TaiKhoan taiKhoan, Model model) {
		System.out.println("CREATE");
		taiKhoan.setMaTaiKhoan(TaiKhoanDao.instance.generateID());
		if (TaiKhoanService.taoTaiKhoanMoi(taiKhoan)) {
			System.out.println("Tao tai khoan thanh cong");
		} else {
			System.out.println("Tao tai khoan that bai");
		}
		return "trangThemTaiKhoan";
	}

}

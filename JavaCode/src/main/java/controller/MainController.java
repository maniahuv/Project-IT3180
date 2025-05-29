package controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import model.TaiKhoan;

@Controller
public class MainController {

	@RequestMapping("/")
	public String home() {
		return "trang1";
	}

	@RequestMapping("/login")
	public String login() {
		return "manHinhDangNhapDangKi";
	}

	@RequestMapping("/register")
	public String register(Model model) {
		model.addAttribute("taiKhoan", new TaiKhoan());
		return "trangThemTaiKhoan";
	}

	@RequestMapping("/quanLiDotThu")
	public String quanLiDotThu() {
		return "QuanLiDotThu";
	}

	@RequestMapping("/quanLiHoKhau")
	public String quanLiHoKhau() {
		return "QuanLiHoKhau";
	}

	@RequestMapping("/quanLiKhoanThu")
	public String quanLiKhoanThu() {
		return "QuanLiKhoanThu";
	}

	@RequestMapping("/quanLiNhanKhau")
	public String quanLiNhanKhau() {
		return "QuanLiNhanKhau";
	}

	@RequestMapping("/tamTruTamVang")
	public String tamTruTamVang() {
		return "TamTruTamVang";
	}

	@RequestMapping("/xemPhieuThu")
	public String xemPhieuThu() {
		return "XemPhieuThu";
	}

	@RequestMapping("/quanLiTaiKhoan")
	public String quanLiTaiKhoan() {
		return "manHinhQuanLiTaiKhoan";
	}

}
